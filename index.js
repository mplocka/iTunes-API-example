// class AppViewModel {
//     public searchText: KnockoutObservable<string>;
//     public songs: KnockoutObservableArray<string>;
//     public recordCount: KnockoutObservable<number>;
//     public visibleSongs: KnockoutObservableArray<>
//     public constructor() {
//     }
// }
function AppViewModel() {
    this.searchText = ko.observable("");
    this.songs = ko.observableArray([]);
    this.recordCount = ko.observable(-1);
    this.visibleSongs = ko.observableArray([]);
    this.currentPage = ko.observable(0);
    this.Search = function () {
        var searchText = this.searchText();
        var request = $.ajax({
            url: "https://itunes.apple.com/search?term=" + searchText + "&entity=song&limit=100",
            method: "GET"
        });
        var self = this;
        request.done(function (msg) {
            var data = JSON.parse(msg);
            self.songs([]);
            self.recordCount(data.resultCount);
            self.visibleSongs([]);
            if (data.resultCount > 0) {
                for (var _i = 0, _a = data.results; _i < _a.length; _i++) {
                    var x = _a[_i];
                    self.songs.push(x);
                }
                for (var n = 0, y = data.resultCount > 9 ? 9 : data.resultCount; n < y; n++) {
                    self.visibleSongs.push(data.results[n]);
                }
                self.currentPage(0);
            }
        });
        request.fail(function (jqXHR, textStatus) {
            alert("Request failed: " + textStatus);
        });
    };
    this.Prev = function () {
        if (this.currentPage() < 1) {
            return;
        }
        this.currentPage(this.currentPage() - 1);
        this.visibleSongs([]);
        for (var x = this.currentPage() * 9, y = this.recordCount() - this.currentPage() * 9 > 9 ? 9 + this.currentPage() * 9 : this.recordCount(); x < y; x++) {
            this.visibleSongs.push(this.songs()[x]);
        }
    };
    this.Next = function () {
        if ((this.currentPage() + 1) * 9 >= this.recordCount()) {
            return;
        }
        this.currentPage(this.currentPage() + 1);
        this.visibleSongs([]);
        for (var x = this.currentPage() * 9, y = this.recordCount() - this.currentPage() * 9 > 9 ? 9 + this.currentPage() * 9 : this.recordCount(); x < y; x++) {
            this.visibleSongs.push(this.songs()[x]);
        }
    };
}
// Activates knockout.js
ko.applyBindings(new AppViewModel());
