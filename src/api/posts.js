import axios from 'axios';
import uuid from 'uuid/v4';
import moment from 'moment';
import cookie from 'react-cookie';
import 'babel-polyfill';

const postKey = 'posts';

var moodlist = ['clear','clouds','drizzle','rain','thunder','snow','windy'];
export function listPosts(searchText = '') {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(_listPosts(searchText));
        }, 500);
    });
}

// Simulated server-side code
function _listPosts(searchText = '') {
    let postString = localStorage.getItem(postKey);
    let posts = postString ? JSON.parse(postString) : [];
    if (posts.length > 0 && searchText) {
        posts = posts.filter(p => {
            return p.text.toLocaleLowerCase().indexOf(searchText.toLowerCase()) !== -1
        });
    }
    return posts;
};

export function createPost(mood, text) {
    return new Promise((resolve, reject) => {
        resolve(_createPost(mood, text));
    });
}

// Simulated server-side code
function _createPost(mood, text) {
    const newPost = {
        id: uuid(),
        mood: mood,
        text: text,
        ts: moment().unix(),
        clearVotes: 0,
        cloudsVotes: 0,
        drizzleVotes: 0,
        rainVotes: 0,
        thunderVotes: 0,
        snowVotes: 0,
        windyVotes: 0
    };
    const posts = [
        newPost,
        ..._listPosts()
    ];
    localStorage.setItem(postKey, JSON.stringify(posts));
    return newPost;
}

export function createVote(id, mood, user) {
    return new Promise((resolve, reject) => {
        _createVote(id, mood, user);
        resolve();
    });
}

// Simulated server-side code
function _createVote(id, mood, user) {
    const posts = _listPosts().map(p => {
      if (p.id === id) {
        const userArr = {
          id: id,
          user: user,
          mood: mood
        };
        var i;
        var situation = 'NC';
        let postSS = localStorage.getItem('pArr');
        let postS = JSON.parse(postSS);
        if(postS === null)
        {
          let postArr = new Array();
          postArr[0] = JSON.stringify(userArr);
          console.log(postArr[0]);
          p[mood.toLowerCase() + 'Votes']++;
          localStorage.setItem('pArr', JSON.stringify(postArr));
        }else {
          let postArr = new Array();
          let len = postS.length;
          for(i = 0; i < len; i++) {
            postArr[i] = JSON.parse(postS[i]);
            if((postArr[i].id === p.id) && (postArr[i].user === user)) {
              if(postArr[i].mood === 'unvoted') {
                p[mood.toLowerCase() + 'Votes']++;
                postArr[i].mood = mood;
              }else if(postArr[i].mood === mood) {
                p[mood.toLowerCase() + 'Votes']--;
                postArr[i].mood = 'unvoted';
              }else {
                p[mood.toLowerCase() + 'Votes']++;
                p[postArr[i].mood.toLowerCase() + 'Votes']--;
                postArr[i].mood = mood;
              }
              situation = 'HC';
            }
          }
          if(situation === 'NC') {
            postArr[i] = JSON.stringify(userArr);
            if (p.id === id) {
              p[mood.toLowerCase() + 'Votes']++;
            }
          }
          for(i = 0; i < len; i++) {
            postArr[i] = JSON.stringify(postArr[i]);
          }
          localStorage.setItem('pArr', JSON.stringify(postArr));
        }
      }
      return p;
    });
    localStorage.setItem(postKey, JSON.stringify(posts));
}
