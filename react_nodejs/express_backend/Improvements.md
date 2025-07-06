# Project Improvements & Issues

This document lists identified inconsistencies and bad practices in the current life cycle and coding structure of the app, along with recommendations for each.

---

## 1. Inconsistent Data Types for Members
- **Issue:** `members` is sometimes an array, sometimes a JSON string, and its type varies between frontend and backend.
- **Recommendation:** Use a consistent type (preferably an array/object) throughout the stack. Only serialize/deserialize at the DB/API boundary.

## 2. Storing Complex Data as JSON Strings in Relational DB
- **Issue:** Fields like `members`, `parents`, `siblings`, `spouses`, `children` are stored as JSON strings in the database.
- **Recommendation:** Use proper relational tables for members and their relationships. Only use JSON for truly unstructured data.

## 3. Redundant and Overlapping Data Structures
- **Issue:** Multiple DTO/DAO types for similar concepts (e.g., `DUserDTO`, `APIFamilyMemberDAO`, `APIFamilyMemberDTO`).
- **Recommendation:** Unify and reuse types as much as possible. Clearly separate API-facing types from internal types.

## 4. Ambiguous Naming and Overloading
- **Issue:** The term `members` is used for both user IDs and full member objects, and sometimes as a string, sometimes as an object/array.
- **Recommendation:** Use precise, descriptive names (e.g., `memberIds`, `memberObjects`, `serializedMembers`).

## 5. Lack of Strong Typing Across API Boundaries
- **Issue:** The API sometimes expects/returns JSON strings, sometimes objects.
- **Recommendation:** Enforce strong typing and validation at the API boundary. Use TypeScript DTOs for both frontend and backend.

#̶#̶ 6̶.̶ B̶u̶s̶i̶n̶e̶s̶s̶ L̶o̶g̶i̶c̶ i̶n̶ C̶o̶n̶t̶r̶o̶l̶l̶e̶r̶s̶
-̶ *̶*̶I̶s̶s̶u̶e̶:̶*̶*̶ B̶a̶c̶k̶e̶n̶d̶ c̶o̶n̶t̶r̶o̶l̶l̶e̶r̶s̶ c̶o̶n̶t̶a̶i̶n̶ s̶i̶g̶n̶i̶f̶i̶c̶a̶n̶t̶ b̶u̶s̶i̶n̶e̶s̶s̶ l̶o̶g̶i̶c̶ (̶e̶.̶g̶.̶,̶ p̶o̶s̶i̶t̶i̶o̶n̶i̶n̶g̶ m̶e̶m̶b̶e̶r̶s̶,̶ c̶r̶e̶a̶t̶i̶n̶g̶ r̶e̶c̶o̶r̶d̶s̶)̶.̶
-̶ *̶*̶R̶e̶c̶o̶m̶m̶e̶n̶d̶a̶t̶i̶o̶n̶:̶*̶*̶ M̶o̶v̶e̶ b̶u̶s̶i̶n̶e̶s̶s̶ l̶o̶g̶i̶c̶ t̶o̶ d̶e̶d̶i̶c̶a̶t̶e̶d̶ s̶e̶r̶v̶i̶c̶e̶ l̶a̶y̶e̶r̶s̶ f̶o̶r̶ b̶e̶t̶t̶e̶r̶ s̶e̶p̶a̶r̶a̶t̶i̶o̶n̶ o̶f̶ c̶o̶n̶c̶e̶r̶n̶s̶ a̶n̶d̶ t̶e̶s̶t̶a̶b̶i̶l̶i̶t̶y̶.̶

## 7. Potential Security Issues
- **Issue:** Storing and parsing JSON from user input without validation can lead to injection or data corruption.
- **Recommendation:** Always validate and sanitize input/output, especially when dealing with JSON blobs.

## 8. Lack of Referential Integrity
- **Issue:** Relationships between members are stored as JSON, not as foreign keys.
- **Recommendation:** Use relational links (foreign keys) for relationships to enforce integrity and enable cascading updates/deletes.

## 9. Mixing Presentation and Data Logic in Frontend
- **Issue:** Some frontend files parse and reformat member data inline, rather than using dedicated utility or model classes.
- **Recommendation:** Use utility/model classes for data transformation, keeping UI components focused on presentation.

## 10. Unclear API Contracts
- **Issue:** The same endpoint may return different shapes/types for the same field (`members`).
- **Recommendation:** Document and enforce clear, versioned API contracts.

---

**Addressing these issues will make the app more robust, maintainable, and scalable.** 