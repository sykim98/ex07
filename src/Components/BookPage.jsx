import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { Row, Col, Button, Form } from 'react-bootstrap'

const BookPage = () => {
    const ref_query = useRef(null);
    const [loading,setLoading] = useState(false);
    const [books,setBooks] = useState([]);
    const [total,setTotal] = useState(0);
    const [page,setPage] = useState(1);
    const [isend,setIsend] = useState(false);
    const [query,setQuery] = useState('리액트');

    const getBooks = async() => {
        const url = "https://dapi.kakao.com/v3/search/book?target=title";
        const config = {
            headers : {"Authorization" : "KakaoAK 9a721d5da920fc1e2ed879739c608759"},
            params : {"query": query, "size":6, "page":page}
        };
        setLoading(true);
        const result=await axios.get(url,config); // async. 비동기를 사용할 때 await 은 필수다.
        setBooks(result.data.documents);
        setTotal(result.data.meta.pageable_count);
        setIsend(result.data.meta.is_end);

        console.log(result);
        setLoading(false);
        ref_query.current.focus();
    }

    useEffect(()=>{
        getBooks();
    },[page]) // []: rendering 처음할 때만 함수 실행, [page] : page 값이 바뀔때마다 함수 실행

    if (loading) return <h1 className='text-center my-5'>Loading....</h1>

    const onSubmit=(e)=>{
        e.preventDefault();
        getBooks();
    }

    return (
        <Row className='my-5 mx-2'>
            <Row>
                <Col className='mb-2'>
                    <Form onSubmit={onSubmit}>
                        <Form.Control value={query}
                            onChange={(e)=>setQuery(e.target.value)}
                            placeholder='검색어'
                            ref={ref_query}
                        />
                    </Form>
                </Col>
                <Col>검색수 : {total}건</Col>
            </Row>
            <hr/>
            <Col>
                <h1 className="text-center">도서검색</h1>
                <Row>
                    {books.map(book=>
                        <Col key={book.isbn} className='box m-2'>
                            <img src={book.thumbnail ? book.thumbnail : 'http://via.placeholder.com/170x150'}/>
                            <div className='ellipsis'>{book.title}</div>
                            <div>{book.price}원</div>
                        </Col>
                    )}
                    <div className='text-center my-3'>
                        <Button disabled={page==1 && true}
                            onClick={()=>setPage(page-1)}>이전</Button>
                        <span className='mx-3'>{page}</span>
                        <Button disabled={isend==true && true}
                            onClick={()=>setPage(page+1)}>다음</Button>
                    </div>
                </Row>
            </Col>
        </Row>
    )
}

export default BookPage