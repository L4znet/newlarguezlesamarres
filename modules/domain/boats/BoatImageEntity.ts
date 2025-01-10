export class BoatImageEntity {
     constructor(
          public readonly url: string,
          public readonly isDefault: boolean,
          public readonly caption: string,
          public readonly contentType: string,
          public readonly base64: string,
          public readonly dimensions: { width: number; height: number },
          public readonly size: string,
          public readonly mimeType: string,
          public readonly fileName: string,
          public readonly boatId: string,
          public readonly id?: string
     ) {}
}
