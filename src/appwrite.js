import { Client, Databases, Query, ID } from 'appwrite';

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLECTION_ID;

const client = new Client()
.setEndpoint('https://cloud.appwrite.io/v1')
.setProject(PROJECT_ID)

const database = new Databases(client)

export const updateSearchCount = async function(searchTerm,movie){
//1. On cherche dans l'api de appwrite si les mots rechercher sont déjà dans la base de donner
try{
    const result =  await database.listDocuments(
        DATABASE_ID,
        COLLECTION_ID, 
        [Query.equal('searchTerms',searchTerm)]
    )
//2. Si ça l'es on mets à jours la colonne count
    if(result.documents.length >0){
        const doc = result.documents[0]
        await database.updateDocument(DATABASE_ID,COLLECTION_ID,doc.$id,{
            count : doc.count + 1
        })
//3. Si il ne l'es pas encore on créer un nouvelle ligne avec la colonne count = 1
    }else{
        await database.createDocument(DATABASE_ID,COLLECTION_ID,ID.unique(),{
            searchTerms : searchTerm,
            count : 1,
            poster_url : `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            movie_id : movie.id
        })
    }
}catch(error){
    console.log(error)
}
}
export const trendingMovies = async function(){
    try{
        const result = database.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [
                Query.limit(5),
                Query.orderDesc('count')
            ]
        )
        return (await result).documents
    }catch(error){
        console.log(error)
    }
}