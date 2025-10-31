declare global {
    interface Pagination {
        per_page: number; // Number of items per page
        page: number; // Current page number
    }

    interface Name {
        search?: string; // Name of the entity
    }

    interface GlobalInterface extends Pagination, Name { }
}

export { };