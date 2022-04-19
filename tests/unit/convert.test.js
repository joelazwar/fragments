const convert = require('../../src/utils/convert');
const fs = require('fs');
const data = Buffer.from('# Plain Text Content');
const json = { json: 'test', random: 'value' };
const file = fs.readFileSync(`${__dirname}/../files/test.webp`);

describe('Convert Module', () => {
  describe('Text Fragment', () => {
    test('Convert to .txt', async () => {
      const { newType, newData } = await convert('text/plain', data, 'txt');

      expect(newType).toBe('text/plain');
      expect(newData).toBe(data);
    });

    test('Unsupported text conversion', async () => {
      try {
        await convert('text/plain', data, 'md');
        expect(true).toBe(false);
      } catch (e) {
        expect(e.message).toBe("'text/plain' fragments can only be converted to '.txt'");
      }
    });
  });

  describe('Markdown Fragment', () => {
    test('Convert to .md', async () => {
      const { newType, newData } = await convert('text/markdown', data, 'md');

      expect(newType).toBe('text/markdown');
      expect(newData).toBe(data);
    });

    test('Convert to .txt', async () => {
      const { newType, newData } = await convert('text/markdown', data, 'txt');

      expect(newType).toBe('text/plain');
      expect(newData).toBe(data);
    });

    test('Convert to .html', async () => {
      const { newType, newData } = await convert('text/markdown', data, 'html');

      expect(newType).toBe('text/html');
      expect(newData).toBe('<h1>Plain Text Content</h1>\n');
    });

    test('Unsupported markdown conversion', async () => {
      try {
        await convert('text/markdown', data, 'csv');
        expect(true).toBe(false);
      } catch (e) {
        expect(e.message).toBe(
          "'text/markdown' fragments can only be converted to '.md', '.html', '.txt'"
        );
      }
    });
  });

  describe('HTML Fragment', () => {
    test('Convert to .html', async () => {
      const { newType, newData } = await convert('text/html', data, 'html');

      expect(newType).toBe('text/html');
      expect(newData).toBe(data);
    });

    test('Convert to .txt', async () => {
      const { newType, newData } = await convert('text/html', data, 'txt');

      expect(newType).toBe('text/plain');
      expect(newData).toBe(data);
    });

    test('Unsupported HTML conversion', async () => {
      try {
        await convert('text/html', data, 'md');
        expect(true).toBe(false);
      } catch (e) {
        expect(e.message).toBe("'text/html' fragments can only be converted to '.html', '.txt'");
      }
    });
  });

  describe('JSON Fragment', () => {
    test('Convert to .json', async () => {
      const { newType, newData } = await convert('application/json', json, 'json');

      expect(newType).toBe('application/json');
      expect(newData).toBe(json);
    });

    test('Convert to .txt', async () => {
      const { newType, newData } = await convert('application/json', json, 'txt');

      expect(newType).toBe('text/plain');
      expect(newData).toBe(json);
    });

    test('Unsupported JSON conversion', async () => {
      try {
        await convert('application/json', json, 'md');
        expect(true).toBe(false);
      } catch (e) {
        expect(e.message).toBe(
          "'application/json' fragments can only be converted to '.json', '.txt'"
        );
      }
    });
  });

  describe('Image Fragments', () => {
    test('Convert to png', async () => {
      const { newType } = await convert('image/webp', file, 'png');

      expect(newType).toBe('image/png');
    });
    test('Convert to jpeg', async () => {
      const { newType } = await convert('image/webp', file, 'jpg');

      expect(newType).toBe('image/jpeg');
    });
    test('Convert to webp', async () => {
      const { newType } = await convert('image/webp', file, 'webp');

      expect(newType).toBe('image/webp');
    });
    test('Convert to gif', async () => {
      const { newType } = await convert('image/webp', file, 'gif');

      expect(newType).toBe('image/gif');
    });
    test('Unsupported image conversion', async () => {
      try {
        await convert('image/webp', file, 'tiff');
        expect(true).toBe(false);
      } catch (e) {
        expect(e.message).toBe('image/webp cannot be converted to .tiff');
      }
    });
  });
});
