import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';





function InputText(props){
    return(
        <div className="InputText">
            <label className="InpNumLab">{props.textForLabel}</label>
        <input type="text" name="url" value={props.imageURL}
        onChange={props.OnChangeimageURL}/>
        </div>   
    );
}

function InputNumber(props){
    return(
        <div className="InputNumber">
            <label className="InpNumLab">
    {props.textForLabel}</label>
            <input type="number" value={props.rowsColumns}>
            </input>
            <button className="PlusButton" name={props.name}
            onClick={props.onClickPlus}>+</button>
            <button className="MinusButton" name={props.name}
            onClick={props.onClickMinus}>-</button>
        </div>
    );
}

function Button(props){
    return (
        <div className="InputButton">
            <button id="start" className="Button" onClick={()=>props.onClick()}>Start Game</button>
            <button id="playAgain" className="Buttonr" onClick={()=>props.playAgain()}>
                <img className="icon"
            src="https://htmlacademy.ru/assets/icons/reload-6x-white.png"></img>Play Again</button>
            <button id="hacker" className="Button" onClick={()=>props.hackerMan()} >Solve Puzzle</button>
        </div>
    );
}

function UserInterface(props){
    const className=(props.status)? "UserSpace":"UserSpaceHidden"
    return (<div id={props.id} className={className}>
        <InputText
        imageURL={props.imageURL}
        textForLabel="Image URL:"
        OnChangeimageURL={props.OnChangeimageURL}        
        />
        <InputNumber
            rowsColumns={props.rows}
            onClickPlus={props.onClickPlus}
            onClickMinus={props.onClickMinus}
            name="numberOfRows"
            textForLabel="Number of rows: "
        />
        <InputNumber
            rowsColumns={props.columns}
            onClickPlus={props.onClickPlus}
            onClickMinus={props.onClickMinus}
            name="numberOfColumns"
            textForLabel="Number of columns: "
        />
        <Button
        onClick={props.onClick} 
        hackerMan={props.hackerMan}
        playAgain={props.playAgain}
        />
        </div>);
    }

    function NavBar(props){
        return(
            <div id="navbar">
            <a className="Title">MyPuzzle</a>
            <a onClick={()=>{props.IconMenuClick()}}className="IconMenu"><i className="fa fa-bars"></i></a> 
            <TimeMeasurment 
            GameIsStarted={props.GameIsStarted}
            gameIsOver={props.gameIsOver}
            callbackFunction={props.callbackFunction}/>
        </div>
        ); 
    }

    function CongratulationMessage(props){
        const invisible={opacity:"0"};
        const visible={opacity:"1", transition:"opacity 5s"};
        return(
        (props.visible)?
        <div id="CongratMessage" style={visible}>
        <a>Awesome! You have finished the game in {props.finalTime}</a>
    </div> : <div id="CongratMessage" style={invisible}>
        <a>Awesome! You have finished the game</a>
    </div>
    );
            
        
    }

    function Image(props){
        const img=document.getElementById("sourceImage");
        const canvas=document.getElementById("canvas");
   
        canvas.width=img.naturalWidth;
        canvas.height=img.naturalHeight;
  
        const peaceWidth=img.naturalWidth
        /props.numberOfColumns;
        const peaceHeight=img.naturalHeight
        /props.numberOfRows;
    
        const startXCoordinate=props.currentColumn
        *peaceWidth-peaceWidth;
        const startYCoordinate=props.currentRow
        *peaceHeight-peaceHeight;
    
        const ctx=canvas.getContext("2d");
        ctx.drawImage(img,startXCoordinate,
           startYCoordinate,peaceWidth,peaceHeight,0,0,
            img.naturalWidth,img.naturalHeight);
        
        const dataURL=canvas.toDataURL();
      
        const imageTracker=
        (props.currentRow-1)*props.numberOfColumns
        +props.currentColumn;
    
        const ImgCanvas=<img src={dataURL} className="img"
        style={props.styleForImg}></img>
            
        return(
            (imageTracker===props.numberOfColumns*props.numberOfRows) ? 
            <div ref={props.RefForImgDiv} className="imgDiv" 
            style={props.imgTracker[imageTracker-1].myStyle}>
            {ImgCanvas}</div> : 
            <div className="imgDiv" 
            onClick={()=>props.onClick(imageTracker-1)}
            style={props.imgTracker[imageTracker-1].myStyle}>
            {ImgCanvas}</div>
        );
    }
    function RowIMG(props){
        const RowImages=[];  
        for(let i=0;i<props.numberOfColumns;i++){
            RowImages.push(<Image
                numberOfRows={props.numberOfRows} 
                numberOfColumns={props.numberOfColumns}
                currentRow={props.currentRow}
                currentColumn={i+1}
                onClick={props.onClick}
                onKeyPress={props.onKeyPress}
                imgTracker={props.imgTracker}
                styleForImg={props.styleForImg}
                RefForImgDiv={props.RefForImgDiv}
                
                />);
        }
        return(
            <div style={props.styleForRows}>
               {RowImages}
            </div>
        );
    }
    function Board(props){
        if(!props.firstTimeRending){
            
            const FullBoard=[];
            for(let i=0;i<props.numberOfRows;i++){
            FullBoard.push(<RowIMG 
                numberOfRows={props.numberOfRows} 
                numberOfColumns={props.numberOfColumns}
                currentRow={i+1}
                onClick={props.onClick}
                onKeyPress={props.onKeyPress}
                imgTracker={props.imgTracker}
                styleForRows={props.styleForRows}
                styleForImg={props.styleForImg}
                RefForImgDiv={props.RefForImgDiv}
                
               />);
        }
        return (  
            <div className="Board">
                {FullBoard}
        </div> 
        );}else{return <div className="Board"></div>;}}

class Game extends React.Component{
    constructor(props){
        super(props);
        this.state={
            numberOfRows:3,
            numberOfColumns:3, 
            imgTracker:[],
            EmptySquare:{
                row:"",
                column:""},
           styleForRows:{width:"100%",height:"33.333%"},
           imgDivWidth:"33.3333%",
           styleForImg:{},
           startGame:false,
           firstTimeRending:true,
           numberOfRowsForUserEdit:3,
           numberOfColumnsForUserEdit:3, /* BecauseRowsOrColumnsHasToBeSetInCreateImageTracker */ 
           UserSpaceDiv:true /*IWantedToHandleUserSpaceDivOnClik*/,
           gameIsOver:false,
           GameIsStarted:false,
           finalTime:"", /*message to add in text after game is solved */
           anObject:{}, /*because I dont want to calculate on every click width and height*/
           imgDivDim:{}

        };
        this.imgDivRef=React.createRef();
        this.handleClick=this.handleClick.bind(this);
        this.handleKeyboard=this.handleKeyboard.bind(this);
        this.mixImages=this.mixImages.bind(this);
        this.CalcWidthHeight=this.CalcWidthHeight.bind(this);
        this.hackerMan=this.hackerMan.bind(this);
        this.HandlePlusButton=this.HandlePlusButton.bind(this);
        this.HandleMinusButton=this.HandleMinusButton.bind(this);
        this.playAgain=this.playAgain.bind(this);
        this.handleIconMenuClick=this.handleIconMenuClick.bind(this);
        this.callbackFunction=this.callbackFunction.bind(this);
    }
    
    hackerMan(){
        const imgTracker=this.state.imgTracker; 
        const emptySquare=this.state.EmptySquare;

        /*const anObject=this.CalcWidthHeight(
            this.state.numberOfRows,
            this.state.numberOfColumns);*/
        /*const imgDivDim=this.CalcImgDivDimens();*/
        let columWidth=this.state.imgDivDim.width+"px";


        for(let i=0;i<imgTracker.length-2;i++){
            imgTracker[i].top=0;imgTracker[i].left=0;
            imgTracker[i].myStyle={
                top:"0px",left:"0px",
                width:this.state.anObject.columWidth,
                
            };
        }
        imgTracker[imgTracker.length-2].top=0; 
        imgTracker[imgTracker.length-2].left=this.state.imgDivDim.width;
        imgTracker[imgTracker.length-2].myStyle=
        {top:"0px",left:this.state.imgDivDim.width+"px",width:this.state.anObject.columWidth};
        imgTracker[imgTracker.length-2].row=this.state.numberOfRows;
        imgTracker[imgTracker.length-2].column=this.state.numberOfColumns;
        emptySquare.row=this.state.numberOfRows;
        emptySquare.column=this.state.numberOfColumns-1;

        this.setState({imgTracker:imgTracker,
            EmptySquare:emptySquare,
            styleForRows:{width:"100%",height:this.state.anObject.rowHeight}
        });
        document.getElementById("hacker").disabled=true;
    }
    CheckForXMoving(placeInArray){
       
        /*const anObject=this.CalcWidthHeight(
            this.state.numberOfRows,
            this.state.numberOfColumns); */
        /*const imgDivDim=this.CalcImgDivDimens(); */
        
        const imgTracker=this.state.imgTracker;
        const columnDifference=this.state.EmptySquare.column-
        imgTracker[placeInArray].column;
        let leftPosition="";
        let topPosition="";
       
        if(Math.abs(columnDifference)==1 && 
        imgTracker[placeInArray].row==this.state.EmptySquare.row){
           
            imgTracker[placeInArray].left+=
            columnDifference*this.state.imgDivDim.width;
            leftPosition=imgTracker[placeInArray].left+"px";
            topPosition=imgTracker[placeInArray].top+"px";

            imgTracker[placeInArray].myStyle={
                left:leftPosition,
                top:topPosition,
                width:this.state.anObject.columWidth
            };
            imgTracker[placeInArray].column+=columnDifference;    

            const emptySquare=this.state.EmptySquare;
            emptySquare.column-=columnDifference;

            this.setState({imgTracker:imgTracker,
                EmptySquare:emptySquare});
            
            this.checkIfGameIsOver();
            return false;
        }  
        return true;   
    }

    CheckForYMoving(placeInArray){
       /* const anObject=this.CalcWidthHeight(
            this.state.numberOfRows,
            this.state.numberOfColumns); */
        /*const imgDivDim=this.CalcImgDivDimens();*/

        const imgTracker=this.state.imgTracker;
        const rowDifference=this.state.EmptySquare.row-
        imgTracker[placeInArray].row;
        let topPosition="";
        let leftPosition="";

        if(Math.abs(rowDifference)==1 && 
        imgTracker[placeInArray].column==this.state.EmptySquare.column){
           
            imgTracker[placeInArray].top+=
            rowDifference*this.state.imgDivDim.height;
            topPosition=imgTracker[placeInArray].top+"px";
            leftPosition=imgTracker[placeInArray].left+"px";
            imgTracker[placeInArray].myStyle={
                top:topPosition,
                left:leftPosition,
                width:this.state.anObject.columWidth};
            imgTracker[placeInArray].row+=rowDifference;    

            const emptySquare=this.state.EmptySquare;
            emptySquare.row-=rowDifference;

            this.setState({imgTracker:imgTracker,
                EmptySquare:emptySquare
            });
            
            this.checkIfGameIsOver();
        }
    }

    checkIfGameIsOver(){
        const imgTracker=this.state.imgTracker;
        const emptySquare=this.state.EmptySquare;

       /* const anObject=this.CalcWidthHeight(
            this.state.numberOfRows,
            this.state.numberOfColumns); */

        let gameIsOver=true;
        for(let i=0;i<imgTracker.length;i++){
            if (imgTracker[i].top!=0 || imgTracker[i].left!=0){
                gameIsOver=false;
                break; 
            }
        }
        if (gameIsOver){
            emptySquare.row="";
            emptySquare.column="";
            for(let i=0;i<imgTracker.length;i++){
                imgTracker[i].myStyle={
                    width:this.state.anObject.columWidth,
                    outline:"2px solid hsl(0,0%,100%,0)",
                    transition:"outline 5s, opacity 5s"
                }
            }
            this.setState({imgTracker:imgTracker,
                EmptySquare:emptySquare,
                gameIsOver:true,
            
            });
        }
    }

    handleKeyboard(catchEvent){
       
        const imgTracker=this.state.imgTracker;
        const EmSqRow=this.state.EmptySquare.row;
        const EmSqCol=this.state.EmptySquare.column;
        let elemToMoveId="";
        let leftPosition; let topPosition;
        if(catchEvent.key==="ArrowRight"){
            if(EmSqCol>1){
                elemToMoveId=
            imgTracker.find(elem=>elem.row==EmSqRow && 
                elem.column+1==EmSqCol).pieceId;
            this.CheckForXMoving(elemToMoveId-1);
            }
        }else if(catchEvent.key==="ArrowLeft"){
            if(EmSqCol<this.state.numberOfColumns){
                elemToMoveId=
            imgTracker.find(elem=>elem.row===EmSqRow && 
                elem.column-1===EmSqCol).pieceId;

            this.CheckForXMoving(elemToMoveId-1);
            }
        }else if(catchEvent.key==="ArrowUp"){
            catchEvent.preventDefault();
            if(EmSqRow<this.state.numberOfRows){
                elemToMoveId=
            imgTracker.find(elem=>elem.column===EmSqCol 
                && elem.row-1===EmSqRow).pieceId;

            this.CheckForYMoving(elemToMoveId-1);
            }
        }else if(catchEvent.key==="ArrowDown"){
            catchEvent.preventDefault();
            if(EmSqRow>1){
                elemToMoveId=
            imgTracker.find(elem=>elem.column==EmSqCol 
                && elem.row+1==EmSqRow).pieceId;

            this.CheckForYMoving(elemToMoveId-1)
            }  
        }
    }
    handleClick(placeInArray){
        if(this.CheckForXMoving(placeInArray)){
            this.CheckForYMoving(placeInArray);
        } 
    }
    mixImages(){
       /* const anObject=this.CalcWidthHeight(
            this.state.numberOfRows,
            this.state.numberOfColumns); */
        const imgDivDim=this.CalcImgDivDimens();
    
        const numberOfPieces=this.state.numberOfRows*
        this.state.numberOfColumns;
        const anArray=[];
        let randomNumber;let topPosition,leftPosition;
        let placeInArray_1,placeInArray_2;
        const imgTracker=this.state.imgTracker;
        let deltaRow,deltaColumn,helpRowColumn;

        for(let i=0;i<numberOfPieces-1;i++){
            anArray.push(i);
        }
        
        while(anArray.length>=2){

            randomNumber=
        Math.floor(Math.random()*anArray.length);
        placeInArray_1=anArray[randomNumber];
        anArray.splice(randomNumber,1);
        
        randomNumber=
        Math.floor(Math.random()*anArray.length);
        placeInArray_2=anArray[randomNumber];
        anArray.splice(randomNumber,1);

        deltaRow=imgTracker[placeInArray_1].row-
        imgTracker[placeInArray_2].row;
        deltaColumn=imgTracker[placeInArray_1].column-
        imgTracker[placeInArray_2].column;

        helpRowColumn=imgTracker[placeInArray_1].row;
        imgTracker[placeInArray_1].row=imgTracker[placeInArray_2].row;
        imgTracker[placeInArray_2].row=helpRowColumn;

        helpRowColumn=imgTracker[placeInArray_1].column;
        imgTracker[placeInArray_1].column=imgTracker[placeInArray_2].column;
        imgTracker[placeInArray_2].column=helpRowColumn;
        
        imgTracker[placeInArray_1].top=(-1)*deltaRow*imgDivDim.height;
        imgTracker[placeInArray_1].left=(-1)*deltaColumn*imgDivDim.width;
        topPosition=imgTracker[placeInArray_1].top+"px";
        leftPosition=imgTracker[placeInArray_1].left+"px";
        imgTracker[placeInArray_1].myStyle={
            width:this.state.anObject.columWidth,
            top:topPosition,
            left:leftPosition
        }
        
        imgTracker[placeInArray_2].top=deltaRow*imgDivDim.height;
        imgTracker[placeInArray_2].left=deltaColumn*imgDivDim.width;
        topPosition=imgTracker[placeInArray_2].top+"px";
        leftPosition=imgTracker[placeInArray_2].left+"px";
        imgTracker[placeInArray_2].myStyle={
            width:this.state.anObject.columWidth,
            top:topPosition,
            left:leftPosition
        }
        }
        const emptySquare=this.state.EmptySquare;
        emptySquare.row=this.state.numberOfRows;
        emptySquare.column=this.state.numberOfColumns;

        imgTracker[imgTracker.length-1].myStyle=
        {opacity:"0",width:this.state.anObject.columWidth,zIndex:"-1"};

            this.setState({
                EmptySquare:emptySquare,
                imgTracker:imgTracker,
                styleForImg:{},
                UserSpaceDiv:!this.state.UserSpaceDiv,
                GameIsStarted:true,
                imgDivDim:imgDivDim
            }); 
        
    document.removeEventListener("keydown",this.handleKeyboard); 
    document.addEventListener("keydown",this.handleKeyboard); 
    document.getElementById("start").disabled=true;
    document.getElementById("hacker").disabled=false;
    }

    CreateImageTracker(rows,columns){  
        const anObject=this.CalcWidthHeight(rows,columns);
        const Tracker={
            pieceId:0,
            row:0,
            column:0,
            left:0,
            top:0,
            myStyle:{
                width:anObject.columWidth,
            }
        };
        const imgTracker=[];
        for(let i=1;i<=rows;i++){
            Tracker.row=i;
            for(let j=1;j<=columns;j++){
                Tracker.pieceId+=1;
                Tracker.column=j;
                imgTracker.push(Object.assign({},Tracker));
            }
        }
        this.setState({
            imgTracker:imgTracker,
            numberOfRows:rows,
            numberOfColumns:columns,
            styleForRows:{
                width:"100%",
                height:anObject.rowHeight
            },
            EmptySquare:{
                row:"",
                column:""},
            GameIsStarted:false,
            gameIsOver:false,
            anObject:anObject
            
        }); 
        document.getElementById("start").disabled=false;
        document.getElementById("hacker").disabled=true;
    }

    HandlePlusButton(e){
        let numberOfRows,numberOfColumns;
        if(e.target.name==="numberOfRows"){
            numberOfRows=this.state.numberOfRows+1;
            numberOfColumns=this.state.numberOfColumns;
            this.setState({
                numberOfRowsForUserEdit:numberOfRows});
            this.CreateImageTracker(numberOfRows,numberOfColumns);
        }else if(e.target.name==="numberOfColumns"){
            numberOfRows=this.state.numberOfRows;
            numberOfColumns=this.state.numberOfColumns+1;
            this.setState({
                numberOfColumnsForUserEdit:numberOfColumns});
            this.CreateImageTracker(numberOfRows,numberOfColumns);
        }
        }

    HandleMinusButton(e){
        let numberOfRows, numberOfColumns;
        if(e.target.name==="numberOfRows"){
            numberOfRows=this.state.numberOfRows-1;
            numberOfColumns=this.state.numberOfColumns;
            this.setState({
                numberOfRowsForUserEdit:numberOfRows});
            this.CreateImageTracker(numberOfRows,numberOfColumns);
        }else if(e.target.name==="numberOfColumns"){
            numberOfRows=this.state.numberOfRows;
            numberOfColumns=this.state.numberOfColumns-1;
            this.setState({
                numberOfColumnsForUserEdit:numberOfColumns});
            this.CreateImageTracker(numberOfRows,numberOfColumns);
        }
    }
    
    CalcWidthHeight(rows,columns){
        const anObject={
            rowHeight:"",
            columWidth:"",
        };
        anObject.rowHeight=100/
        rows+"%";
        anObject.columWidth=100/
        columns+"%";
        return anObject;
    }

    CalcImgDivDimens(){
      
        const imgDivDim={
            width:"",
            height:""
        }
        imgDivDim.width=this.imgDivRef.current.clientWidth;
        imgDivDim.height=this.imgDivRef.current.clientHeight;
        return imgDivDim;  
    }

    playAgain(){
        this.CreateImageTracker(this.state.numberOfRows,
            this.state.numberOfColumns);
            
        setTimeout(function(){
                document.getElementById("playAgain").blur();
            },1000);
       
       
    }
    handleIconMenuClick(){
        this.setState({UserSpaceDiv:!this.state.UserSpaceDiv});
    }
    

    componentDidMount(){
        this.CreateImageTracker(this.state.numberOfRows,
            this.state.numberOfColumns);
        this.setState({firstTimeRending:false});
    }
    callbackFunction(childData){
        this.setState({finalTime:childData});
    }
    render(){
        return(
            <div>
            <NavBar
            IconMenuClick={this.handleIconMenuClick}
            GameIsStarted={this.state.GameIsStarted}
            gameIsOver={this.state.gameIsOver}
            callbackFunction={this.callbackFunction}/>
            <div className="GameDiv">    
            <Board 
            numberOfRows={this.state.numberOfRows}
            numberOfColumns={this.state.numberOfColumns}
            onClick={this.handleClick}
            onKeyPress={this.handleKeyboard}
            imgTracker={this.state.imgTracker}
            styleForRows={this.state.styleForRows}
            styleForImg={this.state.styleForImg}
            firstTimeRending={this.state.firstTimeRending}
            RefForImgDiv={this.imgDivRef}
            
            />
            <UserInterface
            imageURL={this.props.imageURL}
            OnChangeimageURL={this.props.OnChangeimageURL}

            rows={this.state.numberOfRowsForUserEdit}
            columns={this.state.numberOfColumnsForUserEdit}
            onClickPlus={this.HandlePlusButton}
            onClickMinus={this.HandleMinusButton}

            onClick={this.mixImages} 
            hackerMan={this.hackerMan}
            playAgain={this.playAgain}

            id="UserSpace"
            status={this.state.UserSpaceDiv}
            />
           
            </div>
            {this.state.gameIsOver ? 
            <CongratulationMessage visible={true}
            finalTime={this.state.finalTime}/>: <CongratulationMessage visible={false}/>}
            </div>
            
        );
    }
}

function SourceImage(props){
    return (
        <div>
        <img ref={props.RefForSImage}
    src={props.imageURL} id="sourceImage" 
    width="50" height="50" crossorigin="anonymous"
    onLoad={props.onLoad}
    onError={props.onError}/>
    <canvas id="canvas"></canvas>
    
    </div>
    );   
}

class TimeMeasurment extends React.Component{
    constructor(props){
        super(props);
        this.state={
            time:{
                minutes:0,
                seconds:0,
            }}}
    tick(){
        if(this.props.GameIsStarted && !this.props.gameIsOver){
            this.setState({
                time:{
                    minutes:this.state.time.minutes+parseInt((this.state.time.seconds+1)/60)*1,
                    seconds:(this.state.time.seconds+1)%60
                }
            });
        }else if(this.props.GameIsStarted && this.props.gameIsOver){
         this.props.callbackFunction(this.state.time.minutes+" minutes"+" and "+
         this.state.time.seconds+" seconds");
        }
        
        else if (!this.props.GameIsStarted){
            this.setState({
                time:{
                    minutes:0,
                    seconds:0
                }
            });
        }     
    }
    componentDidMount(){
            this.timer=setInterval(
                ()=>this.tick(),1000
            );
    }
    render(){
        
        return(
            <div id="timeClock">
                <a className="timeClock">
        {("0"+this.state.time.minutes).slice(-2)}:{("0"+this.state.time.seconds).slice(-2)}
                </a>
            </div>
        );
    }
    

}



class MainClass extends React.Component{
    constructor(props){
        super(props);
        this.state={
            imageURL:"https://www.success.com/wp-content/uploads/2019/12/How-to-Align-Your-Career-With-Your-Personal-Definition-of-Success.jpg",
            imageIsLoaded:false,
            RendAgain:false,
            RendOnError:false
        }
        this.RefForSImage=React.createRef();
        this.OnChangeimageURL=this.OnChangeimageURL.bind(this);
        this.RendAgainImageIsLoaded=this.RendAgainImageIsLoaded.bind(this);
        this.RendAgainImageLoadError=this.RendAgainImageLoadError.bind(this);
    }
    RendAgainImageIsLoaded(){
        this.setState({RendAgain:true});
    }
    RendAgainImageLoadError(){
        this.setState({RendAgain:!this.state.RendAgain});
    }
    
    OnChangeimageURL(event){
        
        this.setState({
            imageURL:event.target.value
        });
    }
    render(){
        return(
            <div>
                <Game
                imageURL={this.state.imageURL}
                OnChangeimageURL={this.OnChangeimageURL}
                />
                <SourceImage
                imageURL={this.state.imageURL}
                onLoad={this.RendAgainImageIsLoaded}
                onError={this.RendAgainImageLoadError} /*DisableGameWhenChangeOnlyOneCharacterInImageURL*/
                />
            </div>
        );
    }
}


           
ReactDOM.render(<MainClass/>,document.getElementById("root"));