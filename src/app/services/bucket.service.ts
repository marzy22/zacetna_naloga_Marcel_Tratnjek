import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bucket } from '../models/bucket';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BucketService {

  private bucketsUrl = 'http://localhost:3000/buckets';

  constructor(private http: HttpClient) {}

  // Fetch all buckets
  getBuckets(): Observable<Bucket[]> {
    return this.http.get<Bucket[]>(this.bucketsUrl).pipe(
      map((buckets) =>
        buckets.map((bucket) => ({
          ...bucket,
          files: bucket.files.map((file) => ({
            ...file,
            lastModified: file.lastModified ? new Date(file.lastModified) : null
          }))
        }))
      )
    );
  }

 // getBucketById(id: number): Observable<Bucket> {
 //   return this.http.get<Bucket>(`${this.bucketsUrl}/${id}`);
 // }

 getBucketById(id: number): Observable<Bucket[]> {
  return this.http.get<Bucket[]>(`${this.bucketsUrl}?id=${id}`);
}

  // Add a new bucket
 // addBucket(bucket: Bucket): Observable<Bucket> {
   // return this.http.post<Bucket>(this.bucketsUrl, bucket);
 // }

 addBucket(bucket: Bucket): Observable<Bucket> {
  return this.http.post<Bucket>(this.bucketsUrl, bucket);
}

  // Get the highest ID from existing buckets and return the next ID
  getNextId(): Observable<number> {
    return this.http.get<Bucket[]>(this.bucketsUrl).pipe(
      map((buckets) => {
        if (buckets.length === 0) {
          return 1; // If no buckets exist, return 1 as the first id
        }
        const maxId = Math.max(...buckets.map((bucket) => Number(bucket.id!))); // Find the highest id
        return maxId + 1; // Return the next id
      })
    );
  }

  updateBucket(bucket: Bucket): Observable<Bucket> {
    return this.http.put<Bucket>(`${this.bucketsUrl}/${bucket.id}`, bucket);
  }

  deleteBucket(bucketId: string): Observable<void> {
    return this.http.delete<void>(`${this.bucketsUrl}/${bucketId}`);
  }
}
