# Security Specification & Test Payloads (수완신도시공인중개사사무소)

## 1. Data Invariants
1. `properties`: Public can only read listings where `isVisible == true` (unless authenticated as admin). Only verified admins (specifically including `phs760904@gmail.com` or admins registered in `/admins/{uid}`) can create, update, or delete properties.
2. `properties`: ID must conform to valid alphanumeric formats. Title, address, price, and required fields must not exceed specified length boundaries.
3. `inquiries`: Anyone can create an inquiry (`create`), but cannot update or delete inquiries. Only admins can read (`list`, `get`), update status, or delete inquiries.
4. `admins`: Only existing verified superadmins can write to `/admins/{adminId}`. Public cannot read or write to `/admins/`.

## 2. The Dirty Dozen Payloads (Should all fail with PERMISSION_DENIED)
1. **Unauthenticated Property Create**: Anonymous user tries to create a new property document without auth.
2. **Unverified Email Property Create**: User with non-admin email creates a property.
3. **Property Shadow Update**: User attempts to update a property without admin role.
4. **Invalid Property Type Injection**: Admin tries to inject malicious type like `"propertyType": "<script>alert(1)</script>"`.
5. **Oversized Field Overflow**: Injection of a 10MB string into property `title` or `description`.
6. **Malicious ID Poisoning**: Trying to create property with document ID containing path traversal `../../etc`.
7. **PII Inquiry Snooping**: Unauthenticated user attempts to list all client phone numbers from `/inquiries`.
8. **Inquiry Tampering**: Public user attempts to alter someone else's inquiry status or delete inquiry records.
9. **Self-Promoted Admin Escalation**: Public user tries to write `{"role": "admin"}` to `/admins/{uid}`.
10. **Admin Record Tampering**: Non-superadmin tries to overwrite existing admin records.
11. **Negative Price/Area Injection**: Creation with negative supply area or corrupt coordinates.
12. **Hidden Listing Extraction**: Non-admin query attempting to fetch unapproved or hidden properties (`isVisible == false`).
