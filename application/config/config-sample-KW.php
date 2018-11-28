<?php if (!defined('BASEPATH')) exit('No direct script access allowed');
/*
| -------------------------------------------------------------------
| DATABASE CONNECTIVITY SETTINGS
| -------------------------------------------------------------------
| This file will contain the settings needed to access your database.
|
| For complete instructions please consult the 'Database Connection'
| page of the User Guide.
|
| -------------------------------------------------------------------
| EXPLANATION OF VARIABLES
| -------------------------------------------------------------------
|
|    'connectionString' Hostname, database, port and database type for 
|     the connection. Driver example: mysql. Currently supported:
|                 mysql, pgsql, mssql, sqlite, oci
|    'username' The username used to connect to the database
|    'password' The password used to connect to the database
|    'tablePrefix' You can add an optional prefix, which will be added
|                 to the table name when using the Active Record class
|
*/
return array(
	'components' => array(
		'db' => array(
			'connectionString' => 'mysql:host=localhost;port=3306;dbname=SCHOTTpolls_180124;',
			'emulatePrepare' => true,
			'username' => 'polls',
			'password' => '******',
			'charset' => 'utf8',
			'tablePrefix' => 'lime_',
		),
		
		// Uncomment the following line if you need table-based sessions
		// 'session' => array (
			// 'class' => 'system.web.CDbHttpSession',
			// 'connectionID' => 'db',
			// 'sessionTableName' => '{{sessions}}',
		// ),

        // Disable CSRF protection
        'request' => array(
            'enableCsrfValidation' => false,
        ),
		
		'urlManager' => array(
			'urlFormat' => 'path',
			'rules' => require('routes.php'),
			'showScriptName' => true,
		),
	
	),
	// Use the following config variable to set modified optional settings copied from config-defaults.php
	'config'=>array(
	// debug: Set this to 1 if you are looking for errors. If you still get no errors after enabling this
	// then please check your error-logs - either in your hosting provider admin panel or in some /logs directory
	// on your webspace.
	// LimeSurvey developers: Set this to 2 to additionally display STRICT PHP error messages and get full access to standard templates
		'debug' => 0,
		'debugsql' => 0, // Set this to 1 to enanble sql logging, only active when debug = 2
        'allow_templates_to_overwrite_views' => 1,
        'updatable' => false,

        // Survey default settings
        'survey_allowprev' => 'Y',
        'survey_showxquestions' => 'N',
        'survey_tokenanswerspersistence' => 'Y',
        'survey_sendconfirmation' => 'N',

        // Question default settings
        'question_mandatory' => 'Y',
        'filterout_incomplete_answers' => 'all',

        'statistics_noncompleted' => 1,
        'statistics_showtextinline' => 1,
        'statistics_usegraph' => 1,

        // E-Mail Einstellungen
        'email_default_prefix' => '<p style="font-size:12px;font-family:Arial,Helvetica,sans-serif;">',
        'email_default_suffix' => '</p>',

        // Kann auch im Backend gesetzt werden (Globale Einstellungen > Bounce-Einstellungen)
        'bouncemailheader' => 'X-SGG-BOUNCEWITHHEADER: TRUE',
	)
);
/* End of file config.php */
/* Location: ./application/config/config.php */
