import db_connection from "../db.js";

function index(req,res){
    const sql= "SELECT id,title, author, image FROM db_books.books"
    console.log(sql, "index")
    db_connection.query(sql,(err,results) =>{
        if(err){
            return res.status(500).json({error: "Query fail"})
        }
        res.json(results)
    })
}

function show(req,res){
    const id=parseInt(req.params.id);
    const sql = "SELECT * FROM db_books.reviews JOIN  `books`ON `reviews`.`book_id`= `books`.`id` WHERE `books`.`id` = ?";
    console.log(sql, "id singolo")

    db_connection.query(sql,[id], (err,results) =>{
        if (err){
            return res.status(500).json({error: "Query fail"}) 
        }
        
        const book = { ...results[0] }; 
        book.reviews = results.map(review => ({
            id: review.id,
            name: review.name,
            text: review.text,
            created_at: review.created_at,
            vote: review.vote
        }));

        if(!book){
            return res.status(404).json({error: "L'elemento non esiste"})
        }
        res.json(book);
    }) 

}


function store(req,res) {
    const {id} = req.params;

    const {text,name,vote} = req.body;
    const sql= "INSERT INTO reviews (text,name,vote,book_id) VALUES (?,?,?,?)";

    db_connection.query(sql, [text,name,vote,id], (err,results) => {
        if(err) return res.status(500).json({error: "Database query failed"});
        res.status(201);
        res.json({message: "Review added", id: results.insertId})
    })
}
export {index,show, store};