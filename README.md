1. Analyse du problème :
Problème actuel :
L’entreprise ne dispose d’aucun système structuré pour recueillir et exploiter les feedbacks de ses utilisateurs. Cela rend l’analyse difficile et empêche l’amélioration continue des produits.
Objectif :
Créer un système centralisé pour :
Collecter des notes et commentaires sur des produits numériques
Visualiser les retours
Filtrer les feedbacks par produit ou utilisateur


Entités principales :
User : celui qui donne un feedback
Product : le produit numérique testé
Feedback : l’évaluation donnée par un utilisateur

Relations :
Un utilisateur peut laisser plusieurs feedbacks.
Un feedback appartient à un seul utilisateur et un seul produit.

Fonctionnalité:                          

 Créer un utilisateur                    
 Créer un produit                        
 Donner un feedback (note + commentaire) 
 Lister les feedbacks                    
 Lister les les produit       
 Lister les feedbacks pour un produit


Schéma GraphQL (SDL)graphql:

type User {
  id: ID!
  name: String!
  email: String!
  feedbacks: [Feedback]
}

type Product {
  id: ID!
  name: String!
  description: String
  feedbacks: [Feedback]
}

type Feedback {
  id: ID!
  rating: Int!
  comment: String
  date: String!
  user: User!
  product: Product!
}

type Query {
  getAllProducts: [Product]
  getFeedbackByProduct(productId: ID!): [Feedback]
}

type Mutation {
  createUser(name: String!, email: String!): User
  createProduct(name: String!, description: String): Product
  submitFeedback(userId: ID!, productId: ID!, rating: Int!, comment: String): Feedback
}




Exemples dutilisation :
1/ Créer un utilisateur ( requette):
mutation {
  createUser(name: "Ali", email: "ali@example.com") {
    id
    name
    email
  }
}
 repense :
{
  "data": {
    "createUser": {
      "id": "72ab1e4f-ed94-4d88-8b30-d941bad535db",
      "name": "Ali",
      "email": "ali@example.com"
    }
  }
}

2/ Créer un produit ( requette):
mutation {
  createProduct(name: "Application mobile", description: "Application de notes") {
    id
    name
    description
  }
}

reponse:
{
  "data": {
    "createProduct": {
      "id": "279c19a6-df25-4907-84ee-593203b53e0a",
      "name": "Application mobile",
      "description": "Application de notes"
    }
  }
}

3/Soumettre un feedback(requette):


mutation {
  submitFeedback(
    userId: "72ab1e4f-ed94-4d88-8b30-d941bad535db",
    productId: "279c19a6-df25-4907-84ee-593203b53e0a",
    rating: 5,
    comment: "Très utile !"
  ) {
    id
    rating
    comment
    date
    user {
      name
    }
    product {
      name
    }
  }
}

repense :
{
  "data": {
    "submitFeedback": {
      "id": "5dc4f6a7-de81-4fb1-9d28-5ec01e5c7b02",
      "rating": 5,
      "comment": "Très utile !",
      "date": "2025-06-08T20:36:57.486Z",
      "user": {
        "name": "Ali"
      },
      "product": {
        "name": "Application mobile"
      }
    }
  }
}

4/ Lister les produits ( requette):
query {
  getAllProducts {
    id
    name
    description
  }
}

repense :
{
  "data": {
    "getAllProducts": [
      {
        "id": "7b9db5e6-0dc5-4bd1-9b25-e0dc4a8cc3e7",
        "name": "Application mobile",
        "description": "Application de notes"
      },
    ]
  }
}

5/ Lister les feedbacks pour un produit(requette):
query {
  getFeedbackByProduct(productId: "279c19a6-df25-4907-84ee-593203b53e0a") {
    id
    rating
    comment
    user {
      name
    }
  }
}


repense : 
{
  "data": {
    "getFeedbackByProduct": [
      {
        "id": "5dc4f6a7-de81-4fb1-9d28-5ec01e5c7b02",
        "rating": 5,
        "comment": "Très utile !",
        "user": {
          "name": "Ali"
        }
      }
    ]
  }
}