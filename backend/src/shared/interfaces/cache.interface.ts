export interface CacheManager {
    set(key: string, object: any): Promise<void>;
    get<T>(key: string): Promise<T>;
    del(key: string): Promise<void>;
}
