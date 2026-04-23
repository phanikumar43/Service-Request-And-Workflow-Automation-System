package com.servicedesk.dto;

import lombok.Data;

@Data
public class EmailSettingsDTO {
    private String host;
    private Integer port;
    private String username;
    private String password;
    private String fromEmail;
    private String protocol;
}
