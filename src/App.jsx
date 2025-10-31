import SearchBox from './components/SearchBox'
import data from './data.json'
import { useState } from 'react'
import Comment from './components/Comment';

export default function App(){
    const currentUser = data.currentUser ;
    const [comments , setComments] = useState(data.comments);

    function handleComment(newComment){
        setComments([...comments , newComment]);
    }

    function handleReply(newReply , commentId){

        const updateRelies = (comments) => {
            return comments.map(comment => {
                // if this is the comment we are replying to
                if(comment.id === commentId){
                    return {
                        ...comment,
                        replies : [...(comment.replies || []) , newReply]
                    };
                }

                // if this comment has replies, search them recursively

                if(comment.replies && comment.replies.length > 0){
                    return {
                        ...comment,
                        replies : updateRelies(comment.replies)
                    };
                }

                return comment;
            });
        };

        setComments(updateRelies(comments));
        
    }

    function handleDelete(commentId){

        const deleteComment = (comments) => {
            return comments
            .filter(
                comment => comment.id !== commentId
            )
            .map(comment => {
                if(comment.replies && comment.replies.length > 0){
                    return {
                        ...comment,
                        replies: deleteComment(comment.replies)
                    };
                }

                return comment;
            }

            );
        }

        setComments(deleteComment(comments));

    }
    function handleEdit(commentId, newContent){
        const updateContent = (comments) => {
            return comments.map(comment => {
                if(comment.id === commentId){
                    return {
                        ...comment,
                        content: newContent
                    };
                }
                if(comment.replies && comment.replies.length > 0){
                    return {
                        ...comment,
                        replies: updateContent(comment.replies)
                    };
                }
                return comment;
            });
        };

        setComments(updateContent(comments));
    }
    return (
        <div className='m-6 max-w-3xl md:mx-auto flex flex-col gap-4 ml-4 mr-4'>
            { comments.map( comment => (

                <Comment 
                key={comment.id}
                currentUser={currentUser} 
                comment={comment}
                onAddReply={handleReply}
                onDelete={handleDelete}
                onEdit={handleEdit}
                />
            
                
            ))}
           <SearchBox 
            currentUser={currentUser} 
            onAddComment={handleComment}
            />
        </div>
    )
}