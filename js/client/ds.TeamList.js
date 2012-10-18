

spo.ds.TeamList = function(gid) {
  goog.base(this);
  this.query_ = {
    'url': '/teams/' + gid
  };
};
goog.inherits(spo.ds.TeamList, pstj.ds.List);

spo.ds.TeamList.prototype.loadData = function(content) {
  var teams = content['teams'];

};

spo.ds.TeamList.defMap = {
  // gameid: deferred
};

spo.ds.TeamList.gameMap_ = {
  // gameid: list
};

spo.ds.TeamList.getList = function(gameid) {
  if (!spo.ds.TeamList.defMap_[gameid]) {
    spo.ds.TeamList.defMap_[gameid] = new goog.async.Deferred();
    spo.ds.TeamList.gameMap_[gameid] = new spo.ds.TeamList(gameid);
    spo.ds.Resource.getInstance().get(
      spo.ds.TeamList.gameMap_[gameid].getQuery(), function(response) {
        if (response['status'] != 'ok') {
          spo.ds.TeamList.defMap_[gameid].errback(/** error? */);
        } else {
          spo.ds.TeamList.gameMap_[gameid].loadData(response['content']);
          spo.ds.TeamList.defMap_[gameid].callback(
            spo.ds.TeamList.gameMap_[gameid])
        }
      });

  }
  return spo.ds.TeamList.defMap_[gameid];
};
