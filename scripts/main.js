// ログインユーザのUID
let currentUID = null;

//ログインする時に実行
const logIn = (mail, pass) => {
  firebase
    .auth()
    .signInWithEmailAndPassword(mail, pass) // ログイン実行
    .then((user) => {
      // ログインに成功したときの処理
      console.log('ログインしました', user);
    })
    .catch((error) => {
      // ログインに失敗したときの処理
      console.error('ログインエラー', error);
    });
};

//ログアウトする時に実行
const logOut = () => {
  firebase
    .auth()
    .signOut() // ログアウト実行
    .then(() => {
      // ログアウトに成功したときの処理
      console.log('ログアウトしました');
    })
    .catch((error) => {
      // ログアウトに失敗したときの処理
      console.error('ログアウトエラー', error);
    });
};

//ログイン、ログアウト時の表示要素
const inView = document.querySelectorAll('.logout-view');
const outView = document.querySelectorAll('.login-view');

//ログイン状態が変化した時の表示を変更
const changeView = () => {
  if(currentUID != null) {
    for(i=0;i<inView.length;i++) {
      inView[i].classList.add('view-none');
    }
    for(i=0;i<outView.length;i++) {
      outView[i].classList.remove('view-none');
    }
  }else {
    for (i = 0; i < outView.length; i++) {
      outView[i].classList.add('view-none');
    }
    for (i = 0; i < inView.length; i++) {
      inView[i].classList.remove('view-none');
    }
  }
}

// ログイン状態の変化を監視する
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log('状態：ログイン中', user);
    currentUID = user.uid;
    changeView();
  } else {
    console.log('状態：ログアウト', user);
    currentUID = null;
    changeView();
  }
});

const loginBtn = document.querySelector('#login-button');
const logoutBtn = document.querySelector('#logout-button');

loginBtn.addEventListener('click', event => {
  const mail = document.querySelector('#user-mail').value;
  const pass = document.querySelector('#user-pass').value;
  logIn(mail, pass);
});

logoutBtn.addEventListener('click', event => {
  logOut();
});