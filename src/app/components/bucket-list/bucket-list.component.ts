import {Component, OnInit} from '@angular/core';
import { Bucket } from '../../models/bucket';
import { BucketService } from '../../services/bucket.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-bucket-list',
  templateUrl: './bucket-list.component.html',
  standalone: false,
  styleUrls: ['./bucket-list.component.css']
})
export class BucketListComponent implements OnInit {
  buckets: Bucket[] = [];
  bucketForm: FormGroup;
  submitted: boolean = false;
  createNewEmitted: boolean = false;

  locations: string[] = ['Maribor', 'Ljubljana'];

  constructor(private fb: FormBuilder, private bucketService: BucketService) {
    this.bucketForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required], 
    });
  }

  ngOnInit() {
    this.loadBuckets();
  }

  get f() {
    return this.bucketForm.controls;
  }

  loadBuckets(): void {
    this.bucketService.getBuckets().subscribe((data) => {
      this.buckets = data;
    });
  }

  onSubmit(): void {
    this.submitted = true;

    // If the form is invalid, stop further execution
    if (this.bucketForm.invalid) {
      return;
    }

    // Get the next available ID for the new bucket
    this.bucketService.getNextId().subscribe((nextId) => {
      const newBucket: Bucket = {
        id: nextId.toString(),
        name: this.bucketForm.value['name'],
        location: this.bucketForm.value['location'],
        files: [], // Empty files array
      };

      this.bucketService.addBucket(newBucket).subscribe((response) => {
        alert('Bucket added successfully!');

        // After adding the new bucket, reload the list of buckets
        this.loadBuckets();

        // Reset the form
        this.bucketForm.reset();
        this.submitted = false;
        this.createNewEmitted = false;
      });
    });
  }

  onCreateNew(): void {
    this.createNewEmitted = true;
  }

  onCancelCreate(): void {
    this.createNewEmitted = false;
  }
}
