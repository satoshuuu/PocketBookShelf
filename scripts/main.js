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


document.addEventListener("DOMContentLoaded", function () {
  //ハンバーガーメニュー
  const menuBtn = document.querySelector('.header__menu-btn');
  const menu = document.querySelector('.humberger-menu');
  const closeBtn = document.querySelector('.closs-icon');
  menuBtn.addEventListener('click', event => {
    menu.classList.add('humberger-animation');
  });
  closeBtn.addEventListener('click', event => {
    menu.classList.remove('humberger-animation');
  });
});


//firebase上に画像を保存
const submitImage = document.querySelector('.submit-image');

submitImage.addEventListener('click', event => {
  const bookTitle = document.querySelector('#add-book-title').value;
  const bookImage = document.querySelector('#add-book-image');
  const { files } = bookImage;
  if (files.length === 0) {
    // ファイルが選択されていないため何もせずに終了
    return;
  }
  const file = files[0]; // 選択したファイル
  const fileName = bookTitle; //画像の名前

  console.log('アップロード中...');
  firebase
    .storage()
    .ref(`files/${fileName}`)
    .put(file)
    .then(() => {
      firebase
        .storage()
        .ref(`files/${fileName}`)
        .getDownloadURL()
        .then((url) => {
          // 引数urlにダウンロード用URLの情報が格納されている
          console.log('アップロード完了:', url);
        });
    })
    .catch((error) => {
      console.error('アップロード失敗:', error);
    });
});