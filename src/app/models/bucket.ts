import { FileDetails } from "./fileDetails";

export class Bucket {
    id: string | undefined | null;
    name: string | undefined | null;
    location: string | undefined | null;
    files: FileDetails[] = [];

    constructor() {}
  }