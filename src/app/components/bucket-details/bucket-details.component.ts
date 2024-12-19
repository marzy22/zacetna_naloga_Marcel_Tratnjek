import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { BucketService } from '../../services/bucket.service';
import { Bucket } from '../../models/bucket';
import { ActivatedRoute, Router } from '@angular/router';
import { FileDetails } from '../../models/fileDetails';

@Component({
  selector: 'app-bucket-details',
  templateUrl: './bucket-details.component.html',
  standalone: false,
  styleUrls: ['./bucket-details.component.css']
})
export class BucketDetailsComponent implements OnInit {
  bucketId: string | null = null;
  bucket: Bucket | null = null;
  selectedFile: FileDetails | null = null;
  selectedFileIndex: number | null = null;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  deleteBucketConfirmText: string = 'Do you really want to delete this bucket?';
  deleteObjectConfirmText: string = 'Do you really want to delete this object?';

  constructor(private route: ActivatedRoute, private router: Router, private bucketService: BucketService) {
  }

  ngOnInit(): void {
    // Get the 'id' from the route parameters
    this.bucketId = this.route.snapshot.paramMap.get('id')!;
    
    // Fetch the bucket details by id
    if (this.bucketId) {
      this.bucketService.getBucketById(Number(this.bucketId)).subscribe((bucket) => {
        this.bucket = bucket[0];
      });
    }
  }

  triggerFileSelect(): void {
    this.fileInput.nativeElement.click();
  }

  // Handle file selection and upload
  onFileSelected(event: Event): void {
    if (!this.bucket) {
      return;
    }

    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const selectedFile = input.files[0];

      // Create a new file details object
      const fileDetails: FileDetails = {
        name: selectedFile.name,
        lastModified: selectedFile.lastModified
          ? new Date(selectedFile.lastModified)
          : new Date(),
        size: Math.round(selectedFile.size / 1024), // Convert to KB
        type: selectedFile.type,
      };

      // Add the file to the bucket's files and update the JSON
      this.bucket.files.push(fileDetails);
      this.bucketService.updateBucket(this.bucket).subscribe({
        next: () => {
          console.log('File uploaded successfully!');
        },
        error: (err) => {
          console.error('Error uploading file:', err);
        },
      });
    }
  }

  selectFile(file: FileDetails, index: number): void {
    this.selectedFile = file;
    this.selectedFileIndex = index;
  }
  
  deleteSelectedFile(): void {
    if (this.selectedFileIndex !== null && this.bucket) {
      const confirmed = confirm(this.deleteObjectConfirmText);
      if (confirmed) {
        this.bucket.files.splice(this.selectedFileIndex, 1); // Remove file from the array
        this.selectedFile = null;
        this.selectedFileIndex = null;
  
        // Update the bucket in the JSON file
        this.bucketService.updateBucket(this.bucket).subscribe({
          next: () => alert('File deleted successfully!'),
          error: (err) => console.error('Error deleting file:', err),
        });
      }
    }
  }

  deleteBucket() {
    if (this.bucket && this.bucket.id) {
      if (confirm(this.deleteBucketConfirmText)) {
        this.bucketService.deleteBucket(this.bucket.id).subscribe(() => {
          alert('Bucket deleted successfully.');
          this.router.navigate(['/']); // Navigate back to the bucket after deletion
        });
      }
    }
  }

  onGoBack() {
    this.router.navigate(['/']);
  }

  getTotalFileSize(): number {
    if (!this.bucket || !this.bucket.files) {
        return 0;
    }
    return this.bucket.files.reduce((total, file) => total + (file.size || 0), 0);
}
}
