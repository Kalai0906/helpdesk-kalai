const KnowledgeBase = require("../models/KnowledgeBase");

// CREATE ARTICLE (Admin / Manager)
exports.createArticle = async (req, res) => {
  const { title, content, category, isPublished } = req.body;

  const article = await KnowledgeBase.create({
    title,
    content,
    category,
    createdBy: req.user.id,
    isPublished: isPublished ?? true,
  });

  res.status(201).json({ message: "Article created", article });
};

// GET ALL ARTICLES
exports.getArticles = async (req, res) => {
  const articles = await KnowledgeBase.findAll({
    where: { isPublished: true },
    order: [["createdAt", "DESC"]],
  });

  res.json(articles);
};

// UPDATE ARTICLE (Admin / Manager)
exports.updateArticle = async (req, res) => {
  const { id } = req.params;
  const { title, content, category, isPublished } = req.body;

  const article = await KnowledgeBase.findByPk(id);
  if (!article) return res.status(404).json({ message: "Not found" });

  article.title = title ?? article.title;
  article.content = content ?? article.content;
  article.category = category ?? article.category;
  article.isPublished = isPublished ?? article.isPublished;

  await article.save();

  res.json({ message: "Article updated", article });
};

// DELETE ARTICLE
exports.deleteArticle = async (req, res) => {
  const { id } = req.params;
  const article = await KnowledgeBase.findByPk(id);
  if (!article) return res.status(404).json({ message: "Not found" });

  await article.destroy();
  res.json({ message: "Article deleted" });
};

