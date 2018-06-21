interface Song
{
    wrapperType: string;
    kind: string;
    artistId: string;
    collectionId: string;
    trackId: string;
    artistName: string;
    collectionName: string;
    trackName: string;
    collectionCensoredName: string;
    trackCensoredName: string;
    artistViewUrl: string;
    collectionViewUrl: string;
    trackViewUrl: string;
    previewUrl: string;
    artworkUrl30: string;
    artworkUrl60: string;
    artworkUrl100: string;
    collectionPrice: string;
    trackPrice: string;
    releaseDate: string;
    collectionExplicitness: string;
    trackExplicitness: string;
    discCount: string;
    discNumber: string;
    trackCount: string;
    trackNumber: string;
    trackTimeMillis: string;
    country: string;
    currency: string;
    primaryGenreName: string;
    contentAdvisoryRating: string;
    isStreamable: string;
}


class AppViewModel {
    public searchText: KnockoutObservable<string>;
    public songs: KnockoutObservableArray<Song>;
    public recordCount: KnockoutObservable<number>;
    public visibleSongs: KnockoutObservableArray<Song>;
    public currentPage: KnockoutObservable<number>;

    public constructor() {
        this.searchText = ko.observable("");
        this.songs = ko.observableArray([]);
        this.recordCount = ko.observable(-1);
        this.visibleSongs = ko.observableArray([]);
        this.currentPage = ko.observable(0);
    }

    public Search() {
        const searchText = this.searchText();
        const request = $.ajax({
            url: "https://itunes.apple.com/search?term="+searchText+"&entity=song&limit=100",
            method: "GET",
        });
        request.done(this.RequestDone);
         
        request.fail(function(jqXHR: any, textStatus: string) {
            alert( "Request failed: " + textStatus );
        });
    }

    public Prev() {
        if(this.currentPage() < 1) {
            return;
        }
        this.currentPage(this.currentPage()-1);
        this.visibleSongs([]);
        
        for(let x = this.currentPage() * 9,
                y = this.recordCount() - this.currentPage() * 9 > 9 ? 9 + this.currentPage() * 9 : this.recordCount();
            x < y;
            x++
        ) {
            this.visibleSongs.push(this.songs()[x]);
        }
    }

    public Next() {
        if((this.currentPage() + 1) * 9 >= this.recordCount()) {
             return;
        }
        this.currentPage(this.currentPage() + 1);
        this.visibleSongs([]);

        for(let x=this.currentPage() * 9,
                y=this.recordCount() - this.currentPage() * 9 > 9 ? 9 + this.currentPage() * 9  : this.recordCount();
            x < y;
            x++ 
        ) {
            this.visibleSongs.push(this.songs()[x]);
        }

    };

    private RequestDone = (msg: string) => {
        const data = JSON.parse(msg);

        this.songs([]);
        this.recordCount(data.resultCount);
        this.visibleSongs([]);

        if(data.resultCount > 0) {
            for(let x of data.results){
                this.songs.push(x);
            }
            for(let x=0, y=data.resultCount > 9 ? 9 : data.resultCount ; x < y ; x++) {
                this.visibleSongs.push(data.results[x]);
            }
            this.currentPage(0);

        }   
    }
}


//     function AppViewModel() {
//             this.searchText = ko.observable("");
//             this.songs = ko.observableArray([]);
//             this.recordCount = ko.observable(-1);
//             this.visibleSongs = ko.observableArray([]);
//             this.currentPage = ko.observable(0);
            
//             this.Search = function(){
//                     var searchText = this.searchText();
//                     var request = $.ajax({
//                         url: "https://itunes.apple.com/search?term="+searchText+"&entity=song&limit=100",
//                         method: "GET",
//                     });
                     
//                     var self = this;
//                     request.done(function( msg ) {
//                         var data = JSON.parse(msg);
//                         self.songs([]);
//                         self.recordCount(data.resultCount);
//                         self.visibleSongs([]);
//                         if(data.resultCount > 0) {
//                             for(var x of data.results){
//                                 self.songs.push(x);
//                             }
//                             for(var n=0, y=data.resultCount > 9 ? 9 : data.resultCount ; n < y ; n++ ){
//                                 self.visibleSongs.push(data.results[n]);
//                             }
//                             self.currentPage(0);
//                         }
//                     });
                     
//                     request.fail(function( jqXHR, textStatus ) {
//                         alert( "Request failed: " + textStatus );
//                     });
//             };

//             this.Prev = function(){
//                 if(this.currentPage()<1){
//                     return;
//                 }
//                 this.currentPage(this.currentPage()-1);
//                 this.visibleSongs([]);
//                  for(var x=this.currentPage()*9, y=this.recordCount() -this.currentPage()*9 > 9 ? 9+this.currentPage()*9  : this.recordCount(); x < y ; x++ ){
//                                 this.visibleSongs.push(this.songs()[x]);
//                             }

//             };

//             this.Next = function(){
//                 if((this.currentPage()+1)*9>=this.recordCount()){
//                      return;
//                 }
//                 this.currentPage(this.currentPage()+1);
//                 this.visibleSongs([]);
//                  for(var x=this.currentPage()*9, y=this.recordCount() -this.currentPage()*9 > 9 ? 9+this.currentPage()*9  : this.recordCount(); x < y ; x++ ){
//                                 this.visibleSongs.push(this.songs()[x]);
//                             }


//             };

            
//     }

// Activates knockout.js
ko.applyBindings(new AppViewModel());
