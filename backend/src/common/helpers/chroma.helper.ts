import { Chroma } from "langchain/vectorstores/chroma";
import { ChromaClient } from 'chromadb';

export default class ChromaHelper extends Chroma {

    constructor(embeddings, args){
        super(embeddings,args);
    }
    /**
     * Ensures that a collection exists in the Chroma database. If the
     * collection does not exist, it is created.
     * @returns A promise that resolves with the `Collection` instance.
     */
    async ensureCollection() {
        if (!this.collection) {
            if (!this.index) {
                this.index = new ChromaClient({ path: this.url });
            }
            try {
                this.collection = await this.index.getOrCreateCollection({
                    name: this.collectionName,
                    ...(this.collectionMetadata && { metadata: this.collectionMetadata }),
                });
            }
            catch (err) {
                throw new Error(`Chroma getOrCreateCollection error: ${err}`);
            }
        }
        return this.collection;
    }
    
}