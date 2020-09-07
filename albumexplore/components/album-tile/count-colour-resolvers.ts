// convert item count value to a item count colour values, using some set values
export default function valueToColourStyles(value:number,maxValue:number):ItemCountColour
{
    return countColourConfig[determineUniformPartition(value,maxValue,6)];
}

// given a number, a max number, and a number of partitions, determine which partition the number
// should fall into, always the highest partition if the number is equal to or above the max number.
// the lowest partition is always 1.
function determineUniformPartition(value:number,maxValue:number,partitions:number):number
{
    if (value>=maxValue)
    {
        return partitions;
    }

    var partitionSize:number=maxValue/partitions;
    var currentPartitionValue:number=partitionSize;
    var currentPartition:number=1;

    while (1)
    {
        if (currentPartitionValue>=value)
        {
            return currentPartition;
        }

        currentPartitionValue+=partitionSize;
        currentPartition++;
    }

    return -1;
}

// https://coolors.co/65615e-507393-479c85-b0603b-b9395c-af51b1
// https://coolors.co/2a2623-1c2a35-283732-37261c-401a25-3b213e
const countColourConfig:Record<number,ItemCountColour>={
    1:{
        color:"#adaaa7",
        backgroundColor:"#2a2623cc"
    },
    2:{
        color:"#6692bb",
        backgroundColor:"#1c2a35cc"
    },
    3:{
        color:"#479c85",
        backgroundColor:"#283732cc"
    },
    4:{
        color:"#b0603b",
        backgroundColor:"#37261ccc"
    },
    5:{
        color:"#b9395c",
        backgroundColor:"#401a25cc"
    },
    6:{
        color:"#af51b1",
        backgroundColor:"#3b213ecc"
    }
};