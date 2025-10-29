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
    return (
        <div className='m-6'>
            { comments.map( comment => (

                <Comment 
                key={comment.id}
                currentUser={currentUser} 
                comment={comment}
                onAddReply={handleReply}
                />
            
                
            ))}
           <SearchBox 
            currentUser={currentUser} 
            onAddComment={handleComment}
            />
        </div>
    )
}