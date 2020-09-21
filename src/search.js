const fs = require('fs');
const path = require('path')


// Retrieve the courses data from allCourses.json
let rawdata2 = fs.readFileSync(path.resolve(__dirname,'../data/allCourses.json'))
let everyCourseData = JSON.parse(rawdata2)



// Desc: the main function that search up the course informations
const findClass = (courseName, courseNum) => {

    // Initialize variable where it capitalize both course name and number
    var className = courseName.toUpperCase(), classNum = courseNum.toUpperCase()
    // Initialize variable to check if the object still exist
    var checkClassExist = everyCourseData['children'][checkFaculty(className)]

    // Base case 1: return 'course name not found' if the course name does not exist
    if (checkClassExist  === undefined) 
        return 'Sorry I can\'t find the course name, Please try again'

    var facCourses = checkClassExist['children']                                                    // locate by faculty/department
    var classNameCourses = facCourses[checkClassName(facCourses, className)]['children']            // locate by course name
    // Initialize variable to check if the object still exist
    var checkClassNumExist = classNameCourses[checkClassNum(classNameCourses, classNum)]
    
    // Base case 2: return 'course number not found' if the course number does not exist
    if (checkClassNumExist  === undefined) 
        return 'Sorry I can\'t find the course number, Please try again'

    var classNumCourses = checkClassNumExist['children']                                            // locate by course number

    // Iterate through the course sections
    for (let i = 0; i < classNumCourses.length; i++)
    {
        // Comparing the course ID with the ID inputed by the user
        if (classNumCourses[i]['name'] === `${className} ${classNum}`)
        {
            // Initialize the course object with descriptions & credits
            var courseInfo = `*${classNumCourses[i]['name']}* - ${classNumCourses[i]['title']}\n\n${chopDesc(classNumCourses[i]['description'])}\n*Credits:* ${classNumCourses[i]['credits']}`
            
            // Return the course information into this string format
            if (classNumCourses[i]["WQB"].length > 0)
                return `${courseInfo}\n*WQB:* ${WQBFormat(classNumCourses[i]["WQB"])}\n\n*Link:* ${getUrl(className, classNum)}`    // Add the WQB section if it has one
            else
                return `${courseInfo}\n\n*Link:* ${getUrl(className, classNum)}`
        }
    }
    return 'Sorry I can\'t find it, Please try again'
}



// Desc: get current term and year
const getDate = () => {
    // date - initialize new Date object, month - retrieve current month, year - retrieve current year
    var date = new Date(), month = date.getMonth()+1, year = date.getFullYear(), term = ''

    if (month <= 4)
        term = 'spring'
    else if (month >= 5 && month <= 8)
        term = 'summer'
    else
        term = 'fall'

    return [term, year.toString()]      // return both term and year as a string array
}



// Desc: return the URL link to the course page
const getUrl = (courseName, courseNum) => {
    // term - current term (ex. Fall 2020)
    // lowerCourseName - course name lowercase
    // lowerCourseNum - course number lowercase
    var term = getDate(), lowerCourseName = courseName.toLowerCase(), lowerCourseNum = courseNum.toLowerCase()
    return `http://www.sfu.ca/students/calendar/${term[1]}/${term[0]}/courses/${lowerCourseName}/${lowerCourseNum}.html`
}



// Desc: split description into 2 part (course description and prerequisite)
const chopDesc = (description) => {

    // descArr - splitting description string into an array of words, desTxt - initialize string for course description, prereq - initialize string for prereq/coreq
    var descArr = description.split(" "), descTxt = "", prereq = ""
    
    for (let i = 0; i < descArr.length; i++)
    {
        if (descArr[i] === "Prerequisite:" || descArr[i] === "Corequisite:")
        {
            var tmp = i
            break
        }  
        else if(i === descArr.length-1)
        {
            descTxt += descArr[i]  // it will not add an extra space when index is close to the end
            break
        } 
        else 
        {
            descTxt += descArr[i] + " "
        }
    }
    if (tmp)
    {
        for (let j = tmp; j < descArr.length; j++)
        {
            if (descArr[j] === "Prerequisite:" || descArr[j] === "Corequisite:")
                prereq += "*" + descArr[j] + "* "         // Bold the word 'Prerequisite' or 'Corequisite'
            else if (j === descArr.length - 1)
                prereq += descArr[j]                        // Reducing extra space in the end
            else
                prereq += descArr[j] + " "                  // Adding space
        }
        return `${descTxt}\n\n${prereq}`
    }
    return `${descTxt}`
}



// Desc: find the class name section based on the selected class name
const checkClassName = (courseList, className) => {
    for (let i = 0; i < courseList.length; i++)
    {
        if (courseList[i]['name'] === className)
            return i
    }
    return null
}



// Desc: Providing better format by adding space in between
const WQBFormat = (WQB) => {
    WQBstr = ""
    for (let i = 0; i < WQB.length; i++)
    {
        if (i === WQB.length - 1)
            WQBstr += WQB[i]
        else
            WQBstr += WQB[i] + ", "     // Adding an extra space, so its more readable
    }
    return WQBstr
}



// Desc: find the right index from the facualty
const checkFaculty = (className) => {
    const facultyName = ["Science", "Applied Science", "Arts and Social Science", "Communication/Technology", "Environment", "Other"]
    const facultySec = {
        "Science": ["ACMA", "BISC", "BPK", "CHEM", "EASC", "MATH", "MBB", "PHYS", "SCI", "STAT"],
        "Applied Science": ["CMPT", "ENSC", "MACM", "MSE", "TEKX"],
        "Arts and Social Science": ["COGS", "CRIM", "ECON", "ENGL", "FNST", "FREN", "GSWS", "GERO", "GA", "HS", "HIST", "HUM", "IS", "LBST", "LAS", "LING", "PHIL", "POL", "PSYC", "SA", "WL"],
        "Communication/Technology": ["IAT", "PUB"],
        "Environment": ["ARCH", "ENV", "EVSC", "GEOG", "PLAN", "REM", "SD",],
        "Other": ["ALS", "APMA", "ARAB", "BUS", "CHIN", "CMNS", "CA", "DATA", "DIAL", "DMED", "ECO", "EDUC", "EDPR", "ETEC", "EAS", "FASS", "FNLG", "FAL", "FAN", "GS", "GERM", "GRK", "HSCI", "INS", "ISPO", "ITAL", "JAPN", "LANG", "LBRL", "LS", "MTEC", "MASC", "NEUR", "NUSC", "ONC", "PERS", "PLCY", "PUNJ", "SPAN", "SEE", "URB"]
    }
    const facultyHash = {"Science": 0, "Applied Science": 1, "Arts and Social Science": 2, "Communication/Technology": 3, "Environment": 4, "Other": 5}
    for (let i = 0; i < facultyName.length; i++)
    {
        if (facultySec[facultyName[i]].includes(className))
            return facultyHash[facultyName[i]]
    }
    return null   
}



// Desc: check the course number section
const checkClassNum = (courseList, classNum) => {
    var num = `${classNum[0]}XX`
    for (let i = 0; i < courseList.length; i++)
    {
        if (courseList[i]['name'] === num)
            return i
    }
    return null
}



module.exports = { findClass, chopDesc, checkClassName, checkFaculty, checkClassNum, WQBFormat, getDate }