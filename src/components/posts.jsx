import React, { Component } from 'react';
import Post from './post';

class Posts extends Component {
    state = {
        index: -1,
    }

    update = () => {
        const {
            posts = [],
            pageDuration,
        } = this.props;

        const { index } = this.state;

        this.setState(prevState => ({
            index: prevState.index + 1,
        }));

        if (index < posts.length - 2) {
            setTimeout(this.update, pageDuration)
        }
        
    }

    componentDidMount() {
        this.update();
    }

    render() {
        const { user, posts, pageDuration } = this.props;
        const { index } = this.state;

        if (index === -1) return null;

        return (
            <Post key={index} duration={pageDuration} {...posts[index]} user={user} />
        );
    }
}

export default Posts;