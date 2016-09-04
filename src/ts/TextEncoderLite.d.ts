declare class TextEncoderLite {
    constructor(encoding: string);
    encode: (value: string) => Uint8Array;
}

declare class TextDecoderLite {
    constructor(encoding: string);
    decode: (uint8Array: Uint8Array) => string;
}
