-- Create tables
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE borrowings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    book_id INTEGER REFERENCES books(id),
    borrow_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    return_date TIMESTAMP,
    score INTEGER CHECK (score >= 0 AND score <= 10),
    CONSTRAINT unique_active_borrowing UNIQUE (book_id, return_date)
);

-- Insert 10 users (keeping the original 4 from Postman collection and adding 6 more)
INSERT INTO users (name) VALUES
    ('Eray Aslan'),             -- id: 1
    ('Enes Faruk Meniz'),       -- id: 2
    ('Sefa Eren Şahin'),        -- id: 3
    ('Kadir Mutlu'),            -- id: 4
    ('Mehmet Yılmaz'),          -- id: 5
    ('Ayşe Demir'),             -- id: 6
    ('Fatma Kaya'),             -- id: 7
    ('Ali Öztürk'),             -- id: 8
    ('Zeynep Çelik'),           -- id: 9
    ('Mustafa Şahin');          -- id: 10

-- Insert 10 books (keeping the original 5 from Postman collection and adding 5 more)
INSERT INTO books (name) VALUES
    ('The Hitchhiker''s Guide to the Galaxy'),  -- id: 1
    ('I, Robot'),                               -- id: 2
    ('Dune'),                                   -- id: 3
    ('1984'),                                   -- id: 4
    ('Brave New World'),                        -- id: 5
    ('Foundation'),                             -- id: 6
    ('Neuromancer'),                           -- id: 7
    ('Snow Crash'),                            -- id: 8
    ('The War of the Worlds'),                 -- id: 9
    ('Do Androids Dream of Electric Sheep?');  -- id: 10

-- Insert borrowings to match Postman collection examples
-- For Enes Faruk Meniz (id: 2)
INSERT INTO borrowings (user_id, book_id, borrow_date, return_date, score) VALUES
    -- Past borrowings from collection
    (2, 2, '2023-12-01', '2023-12-15', 5),  -- I, Robot with score 5
    (2, 1, '2023-12-01', '2023-12-15', 10); -- The Hitchhiker's Guide with score 10

-- Current borrowing from collection
INSERT INTO borrowings (user_id, book_id, borrow_date) VALUES
    (2, 5, CURRENT_TIMESTAMP); -- Brave New World currently borrowed

-- Additional borrowings to create interesting data
INSERT INTO borrowings (user_id, book_id, borrow_date, return_date, score) VALUES
    -- Past borrowings
    (1, 3, '2023-11-01', '2023-11-15', 7),  -- Eray's past borrowing
    (3, 4, '2023-11-05', '2023-11-20', 8),  -- Sefa's past borrowing
    (4, 6, '2023-11-10', '2023-11-25', 9),  -- Kadir's past borrowing
    (5, 7, '2023-11-15', '2023-11-30', 6),  -- Mehmet's past borrowing
    (6, 8, '2023-11-20', '2023-12-05', 8),  -- Ayşe's past borrowing
    (7, 9, '2023-11-25', '2023-12-10', 7),  -- Fatma's past borrowing
    (8, 10,'2023-11-30', '2023-12-15', 9);  -- Ali's past borrowing

-- Current borrowings
INSERT INTO borrowings (user_id, book_id, borrow_date) VALUES
    (1, 6, CURRENT_TIMESTAMP - INTERVAL '5 days'),
    (3, 7, CURRENT_TIMESTAMP - INTERVAL '3 days'),
    (5, 8, CURRENT_TIMESTAMP - INTERVAL '1 day');

-- Additional ratings for I, Robot to maintain 5.33 average from collection
INSERT INTO borrowings (user_id, book_id, borrow_date, return_date, score) VALUES
    (3, 2, '2023-10-01', '2023-10-15', 5),
    (4, 2, '2023-10-01', '2023-10-15', 6);