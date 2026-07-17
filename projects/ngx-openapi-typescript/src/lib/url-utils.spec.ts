import { buildUrl, toHttpParams } from './url-utils';

describe('buildUrl', () => {
    it('appends the path to the base URL', () => {
        expect(buildUrl('https://api.example.com', '/pets')).toBe(
            'https://api.example.com/pets',
        );
    });

    it('substitutes path parameters', () => {
        expect(buildUrl('https://api.example.com', '/pets/{petId}', { petId: 42 })).toBe(
            'https://api.example.com/pets/42',
        );
    });

    it('URI-encodes path parameter values', () => {
        expect(buildUrl('', '/items/{name}', { name: 'hello world' })).toBe(
            '/items/hello%20world',
        );
    });

    it('works without a base URL', () => {
        expect(buildUrl('', '/pets')).toBe('/pets');
    });

    it('substitutes multiple path parameters', () => {
        expect(
            buildUrl('', '/a/{x}/b/{y}', { x: 'foo', y: 'bar' }),
        ).toBe('/a/foo/b/bar');
    });
});

describe('toHttpParams', () => {
    it('returns undefined for undefined input', () => {
        expect(toHttpParams(undefined)).toBeUndefined();
    });

    it('sets scalar query params', () => {
        const params = toHttpParams({ limit: 10, offset: 0 });
        expect(params?.get('limit')).toBe('10');
        expect(params?.get('offset')).toBe('0');
    });

    it('appends array query params', () => {
        const params = toHttpParams({ ids: [1, 2, 3] });
        expect(params?.getAll('ids')).toEqual(['1', '2', '3']);
    });

    it('skips null and undefined values', () => {
        const params = toHttpParams({ a: null, b: undefined, c: 'ok' });
        expect(params?.has('a')).toBe(false);
        expect(params?.has('b')).toBe(false);
        expect(params?.get('c')).toBe('ok');
    });
});
