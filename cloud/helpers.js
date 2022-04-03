Moralis.Cloud.define("getUsernamesAndIds", async (request) => {
  const query = new Moralis.Query("User");
  const result = await query.find({ useMasterKey: true });

  return result.map((resultObj) => ({
    username: resultObj.attributes.username,
    id: resultObj.id,
  }));
  /*return result.map((resultObj) => {
    usernamePart: resultObj.attributes.username,
    objectIdPart: resultObj.id;
  }); */
});

Moralis.Cloud.define("getUserObjectById", async (request) => {
  const query = new Moralis.Query("User");
  query.equalTo("objectId", request.params.paramUserId);
  const result = await query.first({ useMasterKey: true });

  return result;
});

Moralis.Cloud.define("userLikingArticle", async (request) => {
  const userQuery = new Moralis.Query("User");
  userQuery.equalTo("objectId", request.params.paramUserId);
  const userLiking = await userQuery.first({ useMasterKey: true });

  const Article = Moralis.Object.extend("Article");
  const articleQuery = new Moralis.Query(Article);
  articleQuery.equalTo("slug", request.params.paramArticleSlug);
  const resultArticle = await articleQuery.first({ useMasterKey: true });

  const usersLikes = resultArticle.relation("usersLikes");
  const likedArticles = userLiking.relation("likedArticles");

  const relationQuery = usersLikes.query();
  relationQuery.equalTo("objectId", request.params.paramUserId);
  const usersAlreadyLiked = await relationQuery
    .find({ useMasterKey: true })
    .then(function (list) {
      return list;
    });

  if (usersAlreadyLiked.length > 0) {
    usersLikes.remove(userLiking);
    likedArticles.remove(resultArticle);

    resultArticle.save(null, { useMasterKey: true });
    userLiking.save(null, { useMasterKey: true });

    return "unliked";
  } else {
    usersLikes.add(userLiking);
    likedArticles.add(resultArticle);

    resultArticle.save(null, { useMasterKey: true });
    userLiking.save(null, { useMasterKey: true });

    return "liked";
  }
});

Moralis.Cloud.define("getArticleUserIdsLikes", async (request) => {
  const Article = Moralis.Object.extend("Article");
  const articleQuery = new Moralis.Query(Article);
  articleQuery.equalTo("slug", request.params.paramArticleSlug);
  const resultArticle = await articleQuery.first({ useMasterKey: true });

  const usersLikes = resultArticle.relation("usersLikes");

  const relationQuery = usersLikes.query();

  const usersAlreadyLiked = await relationQuery
    .find({ useMasterKey: true })
    .then(function (list) {
      return list;
    });

  const usersIdsAlreadyLiked = usersAlreadyLiked.map((user) => user.id);

  return usersIdsAlreadyLiked;
});
