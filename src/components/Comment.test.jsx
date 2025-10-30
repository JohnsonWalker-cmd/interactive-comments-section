import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Comment from './Comment';

// Mock data - similar to your actual data structure
const mockComment = {
    id: 1,
    content: 'This is a test comment',
    createdAt: '1 day ago',
    score: 5,
    user: {
        username: 'testuser',
        image: { 
            png: '/avatars/image-testuser.png' 
        }
    },
    replies: []
};

const mockCurrentUser = {
    username: 'currentuser',
    image: { 
        png: '/avatars/image-currentuser.png' 
    }
};

describe('Comment Component', () => {
    
    // Test 1: Check if comment renders
    test('renders comment content and username', () => {
        render(
            <Comment 
                comment={mockComment} 
                currentUser={mockCurrentUser}
                onAddReply={() => {}}
            />
        );
        
        // Check if content appears
        expect(screen.getByText('This is a test comment')).toBeInTheDocument();
        
        // Check if username appears
        expect(screen.getByText('testuser')).toBeInTheDocument();
        
        // Check if timestamp appears
        expect(screen.getByText('1 day ago')).toBeInTheDocument();
    });

    // Test 2: Check if score displays correctly
    test('displays the correct score', () => {
        render(
            <Comment 
                comment={mockComment} 
                currentUser={mockCurrentUser}
                onAddReply={() => {}}
            />
        );
        
        expect(screen.getByText('5')).toBeInTheDocument();
    });

    // Test 3: Shows "you" badge for current user's comments
    test('shows "you" badge when comment is from current user', () => {
        const currentUserComment = {
            ...mockComment,
            user: {
                username: 'currentuser',
                image: { png: '/avatars/image-currentuser.png' }
            }
        };
        
        render(
            <Comment 
                comment={currentUserComment} 
                currentUser={mockCurrentUser}
                onAddReply={() => {}}
            />
        );
        
        expect(screen.getByText('you')).toBeInTheDocument();
    });

    // Test 4: Shows Delete and Edit for current user
    test('shows Delete and Edit buttons for current user comments', () => {
        const currentUserComment = {
            ...mockComment,
            user: mockCurrentUser
        };
        
        render(
            <Comment 
                comment={currentUserComment} 
                currentUser={mockCurrentUser}
                onAddReply={() => {}}
            />
        );
        
        expect(screen.getByText('Delete')).toBeInTheDocument();
        expect(screen.getByText('Edit')).toBeInTheDocument();
    });

    // Test 5: Shows Reply button for other users
    test('shows Reply button for other users comments', () => {
        render(
            <Comment 
                comment={mockComment} 
                currentUser={mockCurrentUser}
                onAddReply={() => {}}
            />
        );
        
        expect(screen.getByText('Reply')).toBeInTheDocument();
        
        // Should NOT show Delete/Edit
        expect(screen.queryByText('Delete')).not.toBeInTheDocument();
        expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    });

    // Test 6: Reply box appears when Reply is clicked
    test('shows reply textarea when Reply button is clicked', () => {
        render(
            <Comment 
                comment={mockComment} 
                currentUser={mockCurrentUser}
                onAddReply={() => {}}
            />
        );
        
        // Initially, reply box should not be visible
        expect(screen.queryByPlaceholderText('Add a comment...')).not.toBeInTheDocument();
        
        // Click Reply button
        const replyButton = screen.getByText('Reply');
        fireEvent.click(replyButton);
        
        // Now reply box should appear
        expect(screen.getByPlaceholderText('Add a comment...')).toBeInTheDocument();
    });

    // Test 7: Typing in reply box works
    test('allows typing in the reply textarea', () => {
        render(
            <Comment 
                comment={mockComment} 
                currentUser={mockCurrentUser}
                onAddReply={() => {}}
            />
        );
        
        // Click Reply to show textarea
        fireEvent.click(screen.getByText('Reply'));
        
        // Get the textarea and type in it
        const textarea = screen.getByPlaceholderText('Add a comment...');
        fireEvent.change(textarea, { target: { value: 'My test reply' } });
        
        // Check if the value updated
        expect(textarea.value).toBe('My test reply');
    });

    // Test 8: Submitting a reply calls the onAddReply function
    test('calls onAddReply when reply is submitted', () => {
        // Create a mock function to track if it's called
        const mockOnAddReply = vi.fn();
        
        render(
            <Comment 
                comment={mockComment} 
                currentUser={mockCurrentUser}
                onAddReply={mockOnAddReply}
            />
        );
        
        // Click Reply
        fireEvent.click(screen.getByText('Reply'));
        
        // Type in textarea
        const textarea = screen.getByPlaceholderText('Add a comment...');
        fireEvent.change(textarea, { target: { value: 'My reply' } });
        
        // Click REPLY button (submit)
        const submitButton = screen.getByText('REPLY');
        fireEvent.click(submitButton);
        
        // Check if onAddReply was called
        expect(mockOnAddReply).toHaveBeenCalledTimes(1);
        
        // UPDATED: Check parameter order - (reply, commentId)
        const callArgs = mockOnAddReply.mock.calls[0];
        
        // First argument should be the reply object
        expect(callArgs[0]).toMatchObject({
            content: 'My reply',
            replyingTo: 'testuser'
        });
        
        // Second argument should be the comment id
        expect(callArgs[1]).toBe(mockComment.id);
    });

    // Test 9: Reply box closes after submitting
    test('hides reply box after successful submission', () => {
        render(
            <Comment 
                comment={mockComment} 
                currentUser={mockCurrentUser}
                onAddReply={() => {}}
            />
        );
        
        // Open reply box
        fireEvent.click(screen.getByText('Reply'));
        expect(screen.getByPlaceholderText('Add a comment...')).toBeInTheDocument();
        
        // Type and submit
        const textarea = screen.getByPlaceholderText('Add a comment...');
        fireEvent.change(textarea, { target: { value: 'Test' } });
        fireEvent.click(screen.getByText('REPLY'));
        
        // Reply box should disappear
        expect(screen.queryByPlaceholderText('Add a comment...')).not.toBeInTheDocument();
    });

    // Test 10: Empty replies are not submitted
    test('does not submit empty replies', () => {
        const mockOnAddReply = vi.fn();
        
        render(
            <Comment 
                comment={mockComment} 
                currentUser={mockCurrentUser}
                onAddReply={mockOnAddReply}
            />
        );
        
        // Open reply box
        fireEvent.click(screen.getByText('Reply'));
        
        // Try to submit without typing (empty)
        fireEvent.click(screen.getByText('REPLY'));
        
        // onAddReply should NOT be called
        expect(mockOnAddReply).not.toHaveBeenCalled();
    });

    // Test 11: Renders nested replies
    test('renders nested replies recursively', () => {
        const commentWithReplies = {
            ...mockComment,
            replies: [
                {
                    id: 2,
                    content: 'This is a nested reply',
                    createdAt: '1 hour ago',
                    score: 2,
                    replyingTo: 'testuser',
                    user: {
                        username: 'replier',
                        image: { png: '/avatars/image-replier.png' }
                    }
                }
            ]
        };
        
        render(
            <Comment 
                comment={commentWithReplies} 
                currentUser={mockCurrentUser}
                onAddReply={() => {}}
            />
        );
        
        // Check if nested reply appears
        expect(screen.getByText('This is a nested reply')).toBeInTheDocument();
        expect(screen.getByText('replier')).toBeInTheDocument();
    });

    // Test 12: Shows @replyingTo when it exists
    test('displays @username when replying to someone', () => {
        const replyComment = {
            ...mockComment,
            replyingTo: 'originaluser'
        };
        
        render(
            <Comment 
                comment={replyComment} 
                currentUser={mockCurrentUser}
                onAddReply={() => {}}
            />
        );
        
        expect(screen.getByText('@originaluser', { exact: false })).toBeInTheDocument();
    });
});