var express = require('express');
var router = express.Router();

const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

/* GET admin page. */
router.get('/adminview/admindashboard', async function (req, res, next) {
  try {
    const user = req.session.user; // Fetch the user data from session
    if (!user || user.usertype !== 'Admin') {
      // If user is not logged in or not an admin, redirect to login page
      res.redirect('/login');
      return;
    }

    const query = req.query.q // Get the value of the 'q' parameter from the query string
    const users = await prisma.user.findMany()
    let filteredUsers = users.filter(user => user.usertype === 'Admin' || user.usertype === 'Manager' || user.usertype === 'User')

    if (query) { // If a search query is provided, filter the results
      filteredUsers = filteredUsers.filter(user => {
        const fullName = `${user.firstname} ${user.middlename ? user.middlename + ' ' : ''}${user.lastname}`
        return fullName.toLowerCase().includes(query.toLowerCase()) || user.email.toLowerCase().includes(query.toLowerCase())
      })
    }

    res.render('adminview/admindashboard', { title: 'Admin', users: filteredUsers, isEmpty: filteredUsers.length === 0, query: query });
  } catch (err) {
    console.error(err)
    next(err)
  }
});

/* GET logout */
router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
      if (err) {
        console.error(err);
      }
      res.redirect('/login');
    });
  });

router.get('/updateuser', function (req, res) {
      res.redirect('/adminview/updateuser');
  });

  

module.exports = router;