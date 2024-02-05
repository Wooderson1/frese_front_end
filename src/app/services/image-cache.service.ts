import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImageCacheService {

  constructor(private storage: Storage, private http: HttpClient) {}

  async getImage(url: string): Promise<string> {
    const cachedImage = await this.storage.get(url);
    console.log('CI ', cachedImage);

    if (cachedImage) {
      // Image is cached, return it
      return cachedImage;
    } else {
      // Image not in cache, fetch and cache it
      const fetchedImage = await this.http.get(url, { responseType: 'blob' }).toPromise();
      console.log('FI ', fetchedImage);
      const base64Image = await this.blobToBase64(fetchedImage);
      await this.storage.set(url, base64Image);
      return base64Image;
    }
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
