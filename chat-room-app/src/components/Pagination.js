import React, {Component} from "react";


export default class Pagination extends Component{
    constructor(props, paginate){
        super(props);
        const pageNumbers = [];
        console.log(this.props.totalPosts)
        //console.log(this.props.postsPerPage)
        for(let i = 0; i<=Math.ceil(this.props.totalPosts / this.props.postsPerPage);i++){
            pageNumbers.push(i);
        }
        this.state = {
            totalPosts : this.props.totalPosts,
            numPages : pageNumbers,
            pageShowed: [1,2,3,4,5],
            currentPage : 1
        }
    }

    componentWillReceiveProps({totalPosts,postsPerPage}) {
        let pageNumbers = [];
        for(let i = 0; i<=Math.ceil(totalPosts /postsPerPage);i++){
            pageNumbers.push(i);
        }
        this.setState({numPages:pageNumbers});
      }

    moveSection(pageNum){
        let nextPage = this.state.currentPage;
        nextPage++;
        this.props.paginate(pageNum);
        let numpages = this.state.numPages;
        numpages.shift();
        numpages.push(nextPage);
        this.setState({numPages:numpages, currentPage:nextPage});
        console.log("Move Section: "+pageNum);
    }

    render(){
        return (
            <div className="pages">
                <span>Page {this.state.currentPage} of {this.state.totalPosts}</span>
                <nav>
                    <ul className="pagination">
                        {this.state.numPages.map(number=>{
                                
                                if(number > 5){
                                    return null;
                                }else{
                                return <li key={number++} className="page-item">
                                    {number>5 ? (
                                        <a onClick={ ()=> {this.moveSection(this.state.currentPage)}} href="!#" className="next-arrow">></a>
                                    ):(
                                        <a onClick={()=> {this.props.paginate(number++); this.setState({currentPage:number-2})}} href="!#" className="page-link">
                                        {number++}
                                        </a>
                                    )}
                            
                                </li>
                            }})}
                    </ul>
                </nav>
            </div>
        )
    }

}