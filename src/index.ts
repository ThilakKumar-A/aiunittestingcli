import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { Command } from 'commander';

function extractFunctions(source: string) {
  const results: { name: string; code: string }[] = [];

  const functionRegex = /function\s+(\w+)\s*\([^)]*\)\s*{[\s\S]*?}/g;
  let match: any;
  while ((match = functionRegex.exec(source)) !== null) {
    results.push({ name: match[1], code: match[0] });
  }

  const methodRegex =
    /\b(?<!function\s)([a-zA-Z_]\w*)\s*\([^)]*\)\s*:\s*[\w<>\[\]]+\s*{[\s\S]*?}/g;

  while ((match = methodRegex.exec(source)) !== null) {
    if (match[1] !== 'constructor') {
      results.push({ name: match[1], code: match[0] });
    }
  }

  const looseMethodRegex =
    /\b(?<!function\s)([a-zA-Z_]\w*)\s*\([^)]*\)\s*{[\s\S]*?}/g;

  while ((match = looseMethodRegex.exec(source)) !== null) {
    if (match[1] !== 'constructor' && !results.find(r => r.name === match[1])) {
      results.push({ name: match[1], code: match[0] });
    }
  }

  return results;
}


async function sendFunctionToAPI(fn: any): Promise<any> {
  try {
    const res = await axios.post("http://localhost:800/generate", { prompt: fn.code });
    return res.data.response || res.data;
  } catch (err: any) {
    console.error(`Error sending ${fn.name}:`, err.message);
    return { error: err.message };
  }
}

interface SpecItem {
  name: string;
  response: any;
}

export function generateSpecFile(functions: SpecItem[], outputPath: string) {
  const componentFile = path.basename(outputPath, '.spec.ts');

  const className = componentFile
    .split(/[-.]/) 
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');

  let content = `
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, it } from 'node:test';
import { ${className} } from './${componentFile}';

describe('${className}', () => {
  let component: ${className};

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [${className}],
    });
    const fixture = TestBed.createComponent(${className});
    component = fixture.componentInstance;
  });
`;

  for (const fn of functions) {
    if (typeof fn.response === 'string' && fn.response.includes('expect')) {
      const fixedResponse = fn.response.replace(
        /\b(?<!component\.)\b([a-zA-Z_]\w*)\s*\(/g,
        (match, p1) => (functions.find(f => f.name === p1) ? `component.${p1}(` : match)
      );

      content += `
    ${fixedResponse}
`;
    } else {
      content += `
  it('should correctly execute ${fn.name}()', () => {
    const result = component.${fn.name}();
    expect(result).toEqual(${JSON.stringify(fn.response, null, 2)});
  });
`;
    }
  }

  content += `});\n`;

  fs.writeFileSync(outputPath, content.trim() + '\n', 'utf-8');
}

const program = new Command();

program
  .name('ng-func-cli')
  .description('Extract Angular functions and auto-generate spec file using API')
  .argument('<source>', 'Path to Angular TypeScript file')
  .action(async (source) => {
    const sourcePath = path.resolve(source);
    const specPath = sourcePath.replace(/\.ts$/, '.spec.ts');

    if (!fs.existsSync(sourcePath)) {
      console.error(`File not found: ${sourcePath}`);
      process.exit(1);
    }

    const code = fs.readFileSync(sourcePath, 'utf-8');
    const functions = extractFunctions(code);

    console.log(`Found ${functions.length} functions in ${path.basename(sourcePath)}`);

    const results: SpecItem[] = [];
    for (const fn of functions) {
      console.log(`Sending "${fn.name}" to API...`);
      const response = await sendFunctionToAPI(fn);
      results.push({ ...fn, response });
    }

    generateSpecFile(results, specPath);
    console.log(`Spec file created at ${specPath}`);
  });

program.parse(process.argv);
