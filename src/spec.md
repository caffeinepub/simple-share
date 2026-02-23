# Specification

## Summary
**Goal:** Improve upload reliability, center-align dropdown menu items, and update post control icons to pencil and trash.

**Planned changes:**
- Add comprehensive error handling with clear messages for post creation failures
- Add loading indicators and disable submit button during post uploads
- Implement automatic retry logic with exponential backoff for failed uploads
- Add form validation for required fields before submission
- Automatically refresh post list after successful post creation
- Add success toast notification when posts are created
- Center-align all menu items in the three-dot dropdown menu
- Replace Edit icon with pencil icon (Pencil component from lucide-react)
- Replace Delete icon with trash icon (Trash2 component from lucide-react)

**User-visible outcome:** Users will experience reliable uploads with clear feedback, centered menu items in the dropdown, and intuitive pencil/trash icons for editing and deleting posts.
