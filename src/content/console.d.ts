import { CommandParams as importedParams } from '../ts/console/CommandParams';

declare module console {
    export type CommandParams = importedParams;
}
/// <reference path="../../dist/ts/console/CommandParams.d.ts"/>