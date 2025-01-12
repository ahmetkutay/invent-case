export interface User {
    id: number;
    name: string;
}

export interface Book {
    id: number;
    name: string;
}

export interface UserWithBooks extends User {
    books: {
        past: Array<{
            name: string;
            userScore: number;
        }>;
        present: Array<{
            name: string;
        }>;
    };
}

export interface BookWithScore extends Book {
    score: number;
}

export interface Borrowing {
    id: number;
    user_id: number;
    book_id: number;
    borrow_date: Date;
    return_date: Date | null;
    score: number | null;
}