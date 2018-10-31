angular.module('articleApp', ['we7app']);

angular.module('articleApp').controller('commentsCtr', ['$scope', '$compile','config', '$http', function ($scope, $compile, config, $http) {
    $scope.do = config.do;

    $scope.changePage = function (url, page) {
        $http.get(url + '&page=' + page).success(function (data) {
            $scope.comment_list = data.message.message.list;
            $scope.pager = data.message.message.pager;
            if (!$scope.comment_list || $scope.comment_list.length < 1) {
                $('.js-list').html('暂无评论');
            }
            $('.js-pager').html($compile($scope.pager)($scope));
        })
    }
    $scope.changePage(config.get_comments_url, 1);

    $scope.likeComment = function(comment) {
        if ($scope.do == 'comments') {
            return false;
        }
        $http.post(config.like_comment_url, comment).success(function(data) {
            if (data.message.errno == 0) {
                comment.like_num = comment.like_num * 1 + 1;
            } else {
                util.message(data.message.message);
                return false;
            }
        });
    }

    $scope.replyarticle = function(comment) {
        comment.replying = true;
    }
    $scope.cancel = function(comment) {
        comment.replying = false;
    }
    $scope.send = function(comment) {
        $http.post(config.reply_url, comment).success(function(data) {
            if (data.message.errno == 0) {
                comment.replys.push(data.message.message);
                comment.replying = false;
                comment.replycontent = '';
            } else {
                util.message(data.message.message);
                return false;
            }
        });
    }
}]);