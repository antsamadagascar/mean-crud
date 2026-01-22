require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log(' MongoDB Atlas connecté avec succès !');
    console.log('Base de données:', mongoose.connection.db.databaseName);
    
    // Test : création un document
    const Article = require('./models/Article');
    const testArticle = new Article({
      title: 'Test de connexion',
      content: 'Ceci est un test depuis MongoDB Atlas',
      category: 'Technologie'
    });
    
    await testArticle.save();
    console.log('Article de test créé:', testArticle._id);
    
    // Nettoyage
    await Article.findByIdAndDelete(testArticle._id);
    console.log('Article de test supprimé');
    
    process.exit(0);
  } catch (error) {
    console.error(' Erreur de connexion:', error.message);
    console.error('Détails:', error);
    process.exit(1);
  }
};

connectDB();