/*global
	mhr, console, dialog
*/

mhr.article = (function() {
    var articleClassSelector = '.js-article',
        timerDelay = 10000,
        articles = document.querySelectorAll(articleClassSelector),
        i = 0,
        l = articles.length,
        dialog = mhr.get('dialog'),
        body = document.getElementsByTagName('body')[0],
        bodyScrollTop,
        maskEl = mhr.get('mask'),
        dialogEl = dialog.querySelector('.js-dialog-box'),
        charCount = dialog.querySelector('.js-charcount'),
        name = dialog.querySelector('input[name="yourname"]'),
        comment = dialog.querySelector('textarea'),
        closeButton = dialog.querySelector('.js-close'),
        saveButton = dialog.querySelector('.js-save');

    if (!articles) {
        return;
    }

    /**
     * @class
     * Article Class
     */
    function Article(el) {
        this.el = el;
        this.counter = 0;
        this.commentArray = [];
        this.save = this.saveComment.bind(this);
        this.saveEdit = this.saveEditComment.bind(this);
        this.delete = this.deleteComment.bind(this);
        this.edit = this.editComment.bind(this);
        this.init();
    }

    /**
     * Init function, defines variables and add listeners
     */
    Article.prototype.init = function() {
        var me = this,
            thumbUp = this.el.querySelector('.js-thumbup'),
            thumbDown = this.el.querySelector('.js-thumbdown'),
            commentButton = this.el.querySelector('.js-comment'),
            nameValid = false,
            commentValid = false;

        this.el.setAttribute('data-comments', '[]');

        /**
         * Listen for thumb Upto be clicked
         */
        thumbUp.addEventListener('click', function() {
            if (me.counter < 10) {
                me.updateCounter(true);
            }
        });

        /**
         * Listen for thumb downto be clicked
         */
        thumbDown.addEventListener('click', function() {
            if (me.counter > 0) {
                me.updateCounter(false);
            }
        });

        /**
         * Listen for comment button to be clicked
         */
        commentButton.addEventListener('click', function() {
            me.showDialog();
        });

        /**
         * Listen for close button to be clicked
         */
        closeButton.addEventListener('click', function() {
            me.hideDialog();
        });

        /**
         * Listen for when user types on comment area
         */
        comment.addEventListener('input', function(e) {
            var length = e.currentTarget.value.length;
            charCount.innerHTML = length;
            // Make sure is less than 500
            if (length > 500) {
                mhr.addClass(comment, 'invalid');
            } else {
                mhr.removeClass(comment, 'invalid');
            }
            // Check its it valid
            if (length > 0 && length < 500) {
                commentValid = true;
                if (nameValid) {
                    mhr.removeClass(saveButton, 'disabled');
                }
            } else {
                mhr.addClass(saveButton, 'disabled');
                commentValid = false;
            }
        });

        /**
         * Listen for when user types on name input
         */
        name.addEventListener('input', function(e) {
            var length = e.currentTarget.value.length;
            // Check its it valid
            if (length > 0 && length < 20) {
                nameValid = true;
                if (commentValid) {
                    mhr.removeClass(saveButton, 'disabled');
                }

            } else {
                mhr.addClass(saveButton, 'disabled');
                nameValid = false;
            }
        });

    };

    /**
     * Update the counter when thumb goes up or down
     * @param {Boolean} increase Whether its an increase or not
     */
    Article.prototype.updateCounter = function(increase) {
        var me = this,
            counterDisplay = this.el.querySelector('.js-counter');

        if (increase) {
            this.counter++;
        } else {
            this.counter--;
        }
        counterDisplay.innerHTML = this.counter;
    };


    /**
     * Show the Modal Dialog box
     * @param {int} id An id of a comment if there is one
     */
    Article.prototype.showDialog = function(id) {
        mhr.show(maskEl);
        body.style.overflow = 'hidden';
        mhr.show(dialog);
        bodyScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        dialog.style.top = bodyScrollTop + 'px';
        maskEl.style.top = bodyScrollTop + 'px';

        // If we have an id then we are editing
        if (id) {
            name.value = this.commentArray[id].name;
            comment.value = this.commentArray[id].comment;
            saveButton.addEventListener('click', this.saveEdit, false);
            saveButton.id = id;
        } else {
            mhr.addClass(saveButton, 'disabled');
            name.value = '';
            comment.value = '';
            saveButton.addEventListener('click', this.save, false);
        }
    };

    /**
     * Hide the Modal Dialog box
     */
    Article.prototype.hideDialog = function() {
        mhr.hide(dialog);
        body.style.overflow = 'auto';
        body.scrollTop = bodyScrollTop;
        mhr.hide(maskEl);
        saveButton.removeEventListener('click', this.save, false);

    };

     /**
     * Save a comment when the button is clicked for new comment
     */
    Article.prototype.saveComment = function() {
        var commentObject = {},
            name = dialog.querySelector('input[name="yourname"]').value,
            comment = dialog.querySelector('textarea').value;

        // Check if it is valid first
        if (name.length < 1 || comment.length < 1) {
            return;
        }
        // Create an Object
        commentObject.name = name;
        commentObject.comment = comment;
        this.commentArray.push(commentObject);
        this.hideDialog();
        this.updateComments();
        saveButton.removeEventListener('click', this.save, false);
    };

     /**
     * Save a comment that is an edit not a new save
     * @param {!Object} e Event
     */
    Article.prototype.saveEditComment = function(e) {
        var name = dialog.querySelector('input[name="yourname"]').value,
            comment = dialog.querySelector('textarea').value,
            id = e.target.id;

        // Check if it is valid first
        if (name.length < 1 || comment.length < 1) {
            return;
        }

        this.commentArray[id].name = name;
        this.commentArray[id].comment = comment;
        this.hideDialog();
        this.updateComments();
        saveButton.removeEventListener('click', this.save, false);

    };

    /**
     * Once  a comment is save we update the display on the page
     * @param {!Object} e Event
     */
    Article.prototype.updateComments = function() {
        var me = this,
            i = 0,
            length = this.commentArray.length,
            commentSection = this.el.querySelector('.js-comments');

        // Lets remove all comments
        while (commentSection.firstChild) {
            commentSection.removeChild(commentSection.firstChild);
        }
        // Loop through the array of comments and add the HTML to the DOM
        for (i; i < length; i++) {
            commentSection.insertAdjacentHTML('beforeend', '<div class="comment"><p><span class="strong">' + this.commentArray[i].name + '</span><br>' + this.commentArray[i].comment + '</p><p class="t-right"><a class="cta js-edit" data-id="' + i + '">EDIT</a><a class="cta js-delete" data-id="' + i + '">DELETE</a></p></div>');
        }

        // Check if we have comments and if so then add listeners to the edit and delete buttons
        if (length > 0) {
            var deleteButtons = commentSection.querySelectorAll('.js-delete');
            for (var j = 0; j < deleteButtons.length; j++) {
                deleteButtons[j].addEventListener('click', me.delete, false);
            }
            var editButtons = commentSection.querySelectorAll('.js-edit');
            for (var k = 0; k < editButtons.length; k++) {
                editButtons[k].addEventListener('click', me.edit, false);
            }
        }

    };

    /**
     * Delete a comment by removing from array
     * @param {!Object} e Event
     */
    Article.prototype.deleteComment = function(e) {
        var id = e.currentTarget.getAttribute('data-id');
        this.commentArray.splice(id, 1);
        this.updateComments();
    };

    /**
     * Edit a comment
     * @param {!Object} e Event
     */
    Article.prototype.editComment = function(e) {
        var id = e.currentTarget.getAttribute('data-id');
        this.showDialog(id);
    };

     /**
     * Loop through our articles anc create class for each
     */
    while (i < l) {
        new Article(articles[i]);
        ++i;
    }
})();
