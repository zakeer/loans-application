CREATE TABLE "loans" (
	"loan_id"	INTEGER NOT NULL,
	"firstname"	TEXT NOT NULL,
	"lastname"	TEXT NOT NULL,
	"email"	TEXT NOT NULL UNIQUE,
	"purpose"	TEXT,
	"status"	TEXT DEFAULT 'PENDING',
	PRIMARY KEY("loan_id" AUTOINCREMENT)
);