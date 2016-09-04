import * as base64js from '@types/base64-js';

export class Base64 {
    private static textEncoder = new TextEncoderLite('utf-8');
    private static textDecoder = new TextDecoderLite('utf-8');

    /**
     * Enocdes a string as base64
     * @param  {string} value string to encode
     * @return {string}       base64 string
     */
    public static encode(value: string): string {
        if (!value) {
            return;
        }

        var uint8Array = Base64.textEncoder.encode(value);

        return base64js.fromByteArray(uint8Array);
    }

    /**
     * Decodes a base64 string to a utf8 string
     * @param  {string} basee64EncodedString the base64 string
     * @return {string}                      The decoded string
     */
    public static decode(basee64EncodedString: string): string {
        if (!basee64EncodedString) {
            return;
        }

        var decodedUint8Array = base64js.toByteArray(basee64EncodedString);

        return Base64.textDecoder.decode(decodedUint8Array);
    }
}