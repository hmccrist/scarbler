import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { List } from '@material-ui/core';
import { ScrabbleWord } from './wordFinder';
import { ResultRow } from './resultRow';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box >
          <Typography component={'span'} >{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    width: '25vw ',
    maxWidth: '33em',
  },
  myTabs: {
    color: 'black',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
  },
  myTab: {
      background: 'darkgray',
      flexGrow: 1,
      fontSize: 'min(1.5vw, 15px)', //38,
  },
  indicator: {
      background: 'black',
  },
  lists: {
    height: '72vh',
    maxHeight: '60em', //'80vh', //'51.5em',  // 700
    overflow: 'auto',
  },
  listHeaders: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    lineHeight: '10%',
    height: '1.75em',
    backgroundColor: '#f0f0f0',
    paddingBottom: '1%',
    borderBottom: '1px solid lightgray',
    '& p': {
      width: '30%',
      paddingTop: '0.15em', 
    }
  }
}));

type SimpleTabsProps = {
    highestScoringList: Array<ScrabbleWord>,
    longestScoringList: Array<ScrabbleWord>,
    onHover: (scrabbleWord: ScrabbleWord) => void;
    onHoverLeave: () => void;
    onMouseClick: (scrabbleWord: ScrabbleWord) => void;
}

export default function SimpleTabs(props: SimpleTabsProps) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs 
            value={value} 
            onChange={handleChange} 
            aria-label="simple tabs example"
            className={classes.myTabs}
            TabIndicatorProps={{ className: classes.indicator}}
            // variant='scrollable'
            // scrollButtons='auto'
        >
          <Tab label={`Highest Scoring (${props.highestScoringList.length})`} className={classes.myTab} disableRipple {...a11yProps(0)} />
          <Tab label={`Longest Words (${props.longestScoringList.length})`} className={classes.myTab} disableRipple {...a11yProps(1)} />
          <Tab label="Custom Words" className={classes.myTab} disableRipple {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
      <div className={classes.listHeaders}> <p>Word</p> <p>Score</p> <p>Coordinate</p> </div>
        <List className={classes.lists}>
          {props.highestScoringList.map((item, i) => (
              <li>
              <ResultRow 
                word={item.word} 
                score={item.score} 
                index={item.index} 
                dir={item.dir} 
                bgColor={i % 2 === 0 ? 'rgb(220, 220, 220)' : 'rgb(210, 210, 210)'} 
                onHover={() => props.onHover(item)}
                onHoverLeave={() => props.onHoverLeave()}
                onMouseClick={() => props.onMouseClick(item)}
              />
              </li>
          ))}
        </List>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div className={classes.listHeaders}> <p>Word</p> <p>Length</p> <p>Coordinate</p> </div>
        <List className={classes.lists}>
          {props.longestScoringList.map((item, i) => (
              <li>
              <ResultRow 
                word={item.word} 
                score={item.rackLetters.length} 
                index={item.index} dir={item.dir} 
                bgColor={i % 2 === 0 ? 'rgb(220, 220, 220)' : 'rgb(210, 210, 210)'} 
                onHover={() => props.onHover(item)}
                onHoverLeave={() => props.onHoverLeave()}
                onMouseClick={() => props.onMouseClick(item)}
              />
              </li>
          ))}
        </List>
      </TabPanel>
      <TabPanel value={value} index={2}>
        todo
      </TabPanel>
    </div>
  );
}
