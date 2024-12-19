import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize',
  standalone: false
})
export class FileSizePipe implements PipeTransform {
  transform(sizeInKB: number | null | undefined): string {
    if (sizeInKB == null) {
      return 'Unknown size';
    }

    if (sizeInKB >= 1024 * 1024) {
      // Convert to GB
      return `${(sizeInKB / (1024 * 1024)).toFixed(2)} GB`;
    } else if (sizeInKB >= 1024) {
      // Convert to MB
      return `${(sizeInKB / 1024).toFixed(2)} MB`;
    } else {
      // Keep in KB
      return `${sizeInKB.toFixed(2)} KB`;
    }
  }
}
