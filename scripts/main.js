// ログインユーザのUID
let currentUID = null;

//データベースから画像の受け取り
const downloadBookImage = bookImageLocation => firebase
  .storage()
  .ref(bookImageLocation)
  .getDownloadURL()
  .catch((error) => {
    console.error('写真のダウンロードに失敗:', error);
  });

  //Card要素の作成
const createCard = (bookId, bookData) => {
  const divCard = document.createElement('div');
  divCard.classList.add('card');
  divCard.setAttribute('id', bookId);

  const divCardImage = document.createElement('div');
  divCardImage.classList.add('card__image');

  downloadBookImage(bookData.bookImageLocation).then((url) => {
    divCardImage.insertAdjacentHTML("afterbegin", `<img src=${url}>`);
  });

  const divCardDetail = document.createElement('div');
  divCardDetail.classList.add('card__detail');

  const imgCard = document.createElement('img');
  imgCard.src = downloadBookImage(bookData.bookImageLocation);

  const divCardTitle = document.createElement('div');
  divCardTitle.classList.add('card__title');
  divCardTitle.insertAdjacentHTML("afterbegin", bookData.bookTitle);

  const divCardBtn = document.createElement('div');
  divCardBtn.classList.add('card__btn');
  divCardBtn.insertAdjacentHTML("afterbegin", '<button class="card__delete"><i class="fas fa-trash-alt"></i>削除</button>');
  divCardBtn.insertAdjacentHTML("afterbegin", '<button class="card__edit"><i class="fas fa-edit"></i>編集</button>');

  divCard.appendChild(divCardImage);

  divCardDetail.appendChild(divCardTitle);
  divCardDetail.appendChild(divCardBtn);

  divCard.appendChild(divCardDetail);

  document.querySelector('.cards').appendChild(divCard);
}

const resetBookshelfView = () => {
  const deleteCards = document.querySelector('.cards');
  deleteCards.innerHTML = '';
};

const loadBookshelfView = () => {
  resetBookshelfView();

  // 書籍データを取得
  const booksRef = firebase
    .database()
    .ref('books')
    .orderByChild('createdAt');

  // 過去に登録したイベントハンドラを削除
  booksRef.off('child_added');

  // books の child_addedイベントハンドラを登録
  // （データベースに書籍が追加保存されたときの処理）
  booksRef.on('child_added', (bookSnapshot) => {
    const bookId = bookSnapshot.key;
    const bookData = bookSnapshot.val();

    // card要素の作成
    createCard(bookId, bookData);
  });
};

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
    loadBookshelfView();
  } else {
    console.log('状態：ログアウト', user);
    currentUID = null;
    changeView();
  }
});

const loginBtn = document.querySelector('#login-button');
const logoutBtn = document.querySelector('.logout-button');

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

//書籍追加ボタンの機能
const addBookBtn = document.querySelectorAll('.add-book');
addBookBtn.forEach(addBook => {
  addBook.addEventListener('click', event => {
    postModal.classList.add('modal-view');
  });
});
//モーダルを閉じる
const modalClose = document.querySelector('#modal-close');
modalClose.addEventListener('click', event => {
  postModal.classList.remove('modal-view');
});


//firebase上に画像を保存
const submitImage = document.querySelector('.submit-image');
//書籍登録モーダル
const postModal = document.querySelector('.post-modal'); 

//モーダルのファイル選択の動作
const bookImage = document.querySelector('#add-book-image');
const uploadGroup = document.querySelector('#upload-image-group');
bookImage.addEventListener('change', event => {
  const { files } = bookImage;
  const file = files[0];
  if (files.length === 0) {
    // ファイルが選択されていないため何もせずに終了
    return;
  }else {
    document.querySelector('#input-label').classList.add('input-label__change');
    // document.querySelector('#input-label').classList.add('changed');
    document.querySelector('.filename').innerHTML = file.name;
  }
});

//モーダルの送信の動作
submitImage.addEventListener('click', event => {
  const bookTitle = document.querySelector('#add-book-title').value;
  const bookImage = document.querySelector('#add-book-image');
  const { files } = bookImage;
  if (files.length === 0) {
    // ファイルが選択されていないため何もせずに終了
    return;
  }

  const file = files[0]; // 表紙画像ファイル
  const filename = file.name; // 画像ファイル名
  const bookImageLocation = `book-images/${filename}`; // 画像ファイルのアップロード先

  console.log(file);
  firebase
    .storage()
    .ref(bookImageLocation)
    .put(file) // Storageへファイルアップロードを実行
    .then(() => {
      //データベースに書籍データを保存
      const bookData = {
        bookTitle,
        bookImageLocation,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
      };
      return firebase
        .database()
        .ref('books')
        .push(bookData);
    })
    .then(() => {
      //成功した時
    })
    .catch((error) => {
      // 失敗したとき
      console.error('エラー', error);
    });
  //モーダルを消す
  postModal.classList.remove('modal-view');
});