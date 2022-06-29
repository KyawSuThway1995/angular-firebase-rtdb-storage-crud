import { Injectable } from "@angular/core";
import { getDownloadURL, ref, Storage, StorageReference, uploadBytes } from "@angular/fire/storage";
import { deleteObject } from "firebase/storage";
import { from, of } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    readonly storageRef!: StorageReference;
    readonly defaultFilePath = 'images';

    constructor(private storage: Storage) {
        this.storageRef = ref(storage);
    }

    uploadImage(file: File | null, fileNameUUID: string, filePath: string = this.defaultFilePath) {
        return file ? from(uploadBytes(ref(this.storageRef, `${filePath}/${fileNameUUID}`), file)
            .then(resp => getDownloadURL(resp.ref))) : of('');
    }

    deleteImage(fileNameUUID: string, filePath: string = this.defaultFilePath) {
        return fileNameUUID ? deleteObject(ref(this.storageRef, `${filePath}/${fileNameUUID}`)) : Promise.resolve();
    }
}