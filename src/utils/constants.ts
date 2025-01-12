export const STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER: 500,
} as const;

export const ERROR_MESSAGES = {
    USER_NOT_FOUND: 'User not found',
    BOOK_NOT_FOUND: 'Book not found',
    BOOK_ALREADY_BORROWED: 'Book is already borrowed',
    NO_ACTIVE_BORROWING: 'No active borrowing found for this book',
} as const;